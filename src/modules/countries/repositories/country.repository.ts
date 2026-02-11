import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { CountryRow, Database, DATABASE_TOKEN } from '../../../database';
import {
  CityEntity,
  CountryEntity,
  CountrySimpleEntity,
  RegionEntity,
  StateEntity,
  SubregionEntity,
} from '../entities';
import { bestMatch, normalize } from '../helpers/normalize';
import {
  toCityEntity,
  toCountryEntity,
  toRegionEntity,
  toStateEntity,
  toSubregionEntity,
} from '../mappers/country.mapper';
import {
  CitySearchRow,
  CountrySearchRow,
  selectAllCountries,
  selectAllRegions,
  selectAllSubregions,
  selectCitiesByStateId,
  selectCitiesByStateIds,
  selectCityById,
  selectCityNamesForSearch,
  selectCountriesByRegionId,
  selectCountriesBySubregionId,
  selectCountryById,
  selectCountryByIso2,
  selectCountryByIso3,
  selectCountryNamesForSearch,
  selectStateById,
  selectStateNamesForSearch,
  selectStatesByCountryId,
  selectStatesByCountryIds,
  StateSearchRow,
} from '../queries/country.queries';
import {
  CitySearchItem,
  CountryRepository,
  HierarchyOptions,
  SearchResult,
  StateSearchItem,
} from './country.repository.interface';

@Injectable()
export class CountryRepositorySqlite implements CountryRepository {
  /** Cached region/subregion lookups (static reference data). */
  private lookupsCache: [Map<number, RegionEntity>, Map<number, SubregionEntity>] | null = null;

  /** Cached search data (static reference data, loaded once). */
  private searchDataCache: {
    countries: CountrySearchRow[];
    states: StateSearchRow[];
    cities: CitySearchRow[];
    countryLookup: Map<number, { name: string; iso2: string }>;
    stateLookup: Map<number, { name: string; iso2: string }>;
  } | null = null;

  constructor(@Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>) {}

  // ── Public API ──────────────────────────────────────────────

  /**
   * List all countries with hierarchy depth controlled by options.
   * Round 1: lookups + countries (+ states if needed) in parallel.
   * Round 2: cities for all states (if included).
   */
  async findAll(options: HierarchyOptions): Promise<CountryEntity[]> {
    const [[regionMap, subregionMap], rows] = await Promise.all([this.loadLookups(), selectAllCountries(this.db)]);

    if (!rows.length) return [];
    return this.assembleCountries(rows, regionMap, subregionMap, options);
  }

  /**
   * Smart resolve: find a country by numeric ID, ISO2, ISO3, or name.
   * Priority: ID → ISO2 (2 chars) → ISO3 (3 chars) → name (bestMatch).
   */
  async findByTerm(term: string, options: HierarchyOptions): Promise<CountryEntity | null> {
    // 1. Try numeric ID
    const numId = parseInt(term, 10);
    if (!isNaN(numId) && String(numId) === term) {
      const row = await selectCountryById(this.db, numId);
      if (row) return this.assembleCountry(row, options);
      return null;
    }

    // 2. Try ISO2 (2-char code)
    if (term.length === 2) {
      const row = await selectCountryByIso2(this.db, term.toUpperCase());
      if (row) return this.assembleCountry(row, options);
    }

    // 3. Try ISO3 (3-char code)
    if (term.length === 3) {
      const row = await selectCountryByIso3(this.db, term.toUpperCase());
      if (row) return this.assembleCountry(row, options);
    }

    // 4. Fallback to accent/case-insensitive name match
    const searchRows = await selectCountryNamesForSearch(this.db);
    const match = bestMatch(term, searchRows, r => r.name);
    if (!match) return null;

    const row = await selectCountryById(this.db, match.id);
    if (!row) return null;
    return this.assembleCountry(row, options);
  }

  /**
   * Filter countries by region/continent name.
   * Uses accent/case-insensitive matching on region name.
   */
  async findByRegion(name: string, options: HierarchyOptions): Promise<CountryEntity[]> {
    const [regionMap, subregionMap] = await this.loadLookups();

    const regionEntries = [...regionMap.entries()];
    const match = bestMatch(name, regionEntries, ([, r]) => r.name);
    if (!match) return [];

    const rows = await selectCountriesByRegionId(this.db, match[0]);
    if (!rows.length) return [];
    return this.assembleCountries(rows, regionMap, subregionMap, options);
  }

  /**
   * Filter countries by subregion name.
   * Uses accent/case-insensitive matching on subregion name.
   */
  async findBySubregion(name: string, options: HierarchyOptions): Promise<CountryEntity[]> {
    const [regionMap, subregionMap] = await this.loadLookups();

    const subregionEntries = [...subregionMap.entries()];
    const match = bestMatch(name, subregionEntries, ([, s]) => s.name);
    if (!match) return [];

    const rows = await selectCountriesBySubregionId(this.db, match[0]);
    if (!rows.length) return [];
    return this.assembleCountries(rows, regionMap, subregionMap, options);
  }

  /** Get a single state by ID, optionally including its cities. */
  async findStateById(id: number, includeCities: boolean): Promise<StateEntity | null> {
    const row = await selectStateById(this.db, id);
    if (!row) return null;

    const cities = includeCities ? await selectCitiesByStateId(this.db, id) : [];
    return toStateEntity(row, cities);
  }

  /** Get a single city by ID. */
  async findCityById(id: number): Promise<CityEntity | null> {
    const row = await selectCityById(this.db, id);
    if (!row) return null;
    return toCityEntity(row);
  }

  /**
   * Global search across countries, states, and cities.
   * Uses in-memory normalized matching with cached data.
   */
  async search(query: string, limit: number): Promise<SearchResult> {
    const data = await this.loadSearchData();
    const q = normalize(query);
    if (!q) return { countries: [], states: [], cities: [] };

    // Search countries
    const countries: CountrySimpleEntity[] = [];
    for (const c of data.countries) {
      if (countries.length >= limit) break;
      if (normalize(c.name).includes(q)) {
        countries.push({ id: c.id, name: c.name, iso2: c.iso2 ?? '', emoji: c.emoji ?? '' });
      }
    }

    // Search states
    const states: StateSearchItem[] = [];
    for (const s of data.states) {
      if (states.length >= limit) break;
      if (normalize(s.name).includes(q)) {
        const country = data.countryLookup.get(s.country_id);
        states.push({
          id: s.id,
          name: s.name,
          iso2: s.iso2 ?? '',
          country_name: country?.name ?? '',
          country_iso2: country?.iso2 ?? '',
        });
      }
    }

    // Search cities
    const cities: CitySearchItem[] = [];
    for (const c of data.cities) {
      if (cities.length >= limit) break;
      if (normalize(c.name).includes(q)) {
        const country = data.countryLookup.get(c.country_id);
        const state = data.stateLookup.get(c.state_id);
        cities.push({
          id: c.id,
          name: c.name,
          state_name: state?.name ?? '',
          country_name: country?.name ?? '',
          country_iso2: country?.iso2 ?? '',
        });
      }
    }

    return { countries, states, cities };
  }

  // ── Private helpers ─────────────────────────────────────────

  /** Assemble a single CountryEntity with optional states/cities. */
  private async assembleCountry(row: CountryRow, options: HierarchyOptions): Promise<CountryEntity> {
    const [regionMap, subregionMap] = await this.loadLookups();

    if (!options.includeStates) {
      return toCountryEntity(row, [], regionMap, subregionMap);
    }

    const stateRows = await selectStatesByCountryId(this.db, row.id);
    if (!stateRows.length) {
      return toCountryEntity(row, [], regionMap, subregionMap);
    }

    if (!options.includeCities) {
      const states = stateRows.map(s => toStateEntity(s, []));
      return toCountryEntity(row, states, regionMap, subregionMap);
    }

    const cities = await selectCitiesByStateIds(
      this.db,
      stateRows.map(s => s.id),
    );
    const states = stateRows.map(s => toStateEntity(s, cities.get(s.id) ?? []));
    return toCountryEntity(row, states, regionMap, subregionMap);
  }

  /** Assemble multiple CountryEntity objects with optional states/cities. */
  private async assembleCountries(
    rows: CountryRow[],
    regionMap: Map<number, RegionEntity>,
    subregionMap: Map<number, SubregionEntity>,
    options: HierarchyOptions,
  ): Promise<CountryEntity[]> {
    if (!options.includeStates) {
      return rows.map(r => toCountryEntity(r, [], regionMap, subregionMap));
    }

    const countryIds = rows.map(r => r.id);
    const stateRows = await selectStatesByCountryIds(this.db, countryIds);

    if (!stateRows.length) {
      return rows.map(r => toCountryEntity(r, [], regionMap, subregionMap));
    }

    let citiesMap: Map<number, CityEntity[]> = new Map();
    if (options.includeCities) {
      citiesMap = await selectCitiesByStateIds(
        this.db,
        stateRows.map(s => s.id),
      );
    }

    const statesByCountry = new Map<number, StateEntity[]>();
    for (const s of stateRows) {
      const list = statesByCountry.get(s.country_id) ?? [];
      list.push(toStateEntity(s, citiesMap.get(s.id) ?? []));
      statesByCountry.set(s.country_id, list);
    }

    return rows.map(r => toCountryEntity(r, statesByCountry.get(r.id) ?? [], regionMap, subregionMap));
  }

  /** Load and cache region/subregion lookup maps (static data, loaded once). */
  private async loadLookups(): Promise<[Map<number, RegionEntity>, Map<number, SubregionEntity>]> {
    if (this.lookupsCache) return this.lookupsCache;

    const [regionRows, subregionRows] = await Promise.all([selectAllRegions(this.db), selectAllSubregions(this.db)]);

    const regionMap = new Map(regionRows.map(r => [r.id, toRegionEntity(r)]));
    const subregionMap = new Map(subregionRows.map(r => [r.id, toSubregionEntity(r)]));

    this.lookupsCache = [regionMap, subregionMap];
    return this.lookupsCache;
  }

  /** Load and cache all name data for the global search feature. */
  private async loadSearchData() {
    if (this.searchDataCache) return this.searchDataCache;

    const [countries, states, cities] = await Promise.all([
      selectCountryNamesForSearch(this.db),
      selectStateNamesForSearch(this.db),
      selectCityNamesForSearch(this.db),
    ]);

    const countryLookup = new Map<number, { name: string; iso2: string }>();
    for (const c of countries) {
      countryLookup.set(c.id, { name: c.name, iso2: c.iso2 ?? '' });
    }

    const stateLookup = new Map<number, { name: string; iso2: string }>();
    for (const s of states) {
      stateLookup.set(s.id, { name: s.name, iso2: s.iso2 ?? '' });
    }

    this.searchDataCache = { countries, states, cities, countryLookup, stateLookup };
    return this.searchDataCache;
  }
}
