import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database, DATABASE_TOKEN } from '../../../database';
import { CountryEntity, RegionEntity, StateEntity, SubregionEntity } from '../entities';
import { bestMatch } from '../helpers/normalize';
import { toCountryEntity, toRegionEntity, toStateEntity, toSubregionEntity } from '../mappers/country.mapper';
import {
  selectAllCountries,
  selectAllRegions,
  selectAllStates,
  selectAllSubregions,
  selectCitiesByStateIds,
  selectCountryById,
  selectCountryNamesForSearch,
  selectStateNamesForSearch,
  selectStatesByCountryId,
} from '../queries/country.queries';
import { CountryRepository } from './country.repository.interface';

@Injectable()
export class CountryRepositorySqlite implements CountryRepository {
  /** Cached region/subregion lookups (static reference data). */
  private lookupsCache: [Map<number, RegionEntity>, Map<number, SubregionEntity>] | null = null;

  constructor(@Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>) {}

  /**
   * List — all countries with states and cities.
   * Round 1: lookups + countries + states in parallel.
   * Round 2: cities for all states.
   */
  async findAll(): Promise<CountryEntity[]> {
    const [[regionMap, subregionMap], rows, stateRows] = await Promise.all([
      this.loadLookups(),
      selectAllCountries(this.db),
      selectAllStates(this.db),
    ]);

    if (!rows.length) return [];
    if (!stateRows.length) return rows.map(r => toCountryEntity(r, [], regionMap, subregionMap));

    const cities = await selectCitiesByStateIds(
      this.db,
      stateRows.map(s => s.id),
    );

    const statesByCountry = new Map<number, StateEntity[]>();
    for (const s of stateRows) {
      const list = statesByCountry.get(s.country_id) ?? [];
      list.push(toStateEntity(s, cities.get(s.id) ?? []));
      statesByCountry.set(s.country_id, list);
    }

    return rows.map(r => toCountryEntity(r, statesByCountry.get(r.id) ?? [], regionMap, subregionMap));
  }

  /**
   * Detail — accent/case-insensitive best match by country name.
   * Round 1: lean search (id + name only).
   * Round 2: full country + lookups + states in parallel.
   * Round 3: cities for matched states.
   */
  async findByName(name: string): Promise<CountryEntity | null> {
    const searchRows = await selectCountryNamesForSearch(this.db);
    const match = bestMatch(name, searchRows, r => r.name);
    if (!match) return null;

    const [[regionMap, subregionMap], countryRow, stateRows] = await Promise.all([
      this.loadLookups(),
      selectCountryById(this.db, match.id),
      selectStatesByCountryId(this.db, match.id),
    ]);
    if (!countryRow) return null;

    if (!stateRows.length) return toCountryEntity(countryRow, [], regionMap, subregionMap);

    const cities = await selectCitiesByStateIds(
      this.db,
      stateRows.map(s => s.id),
    );
    const states = stateRows.map(s => toStateEntity(s, cities.get(s.id) ?? []));
    return toCountryEntity(countryRow, states, regionMap, subregionMap);
  }

  /**
   * Find country by state name — accent/case-insensitive best match.
   * Round 1: lean state search (id + name + country_id).
   * Round 2: full country + lookups + states in parallel.
   * Round 3: cities for matched states.
   */
  async findCountryByStateName(name: string): Promise<CountryEntity | null> {
    const searchRows = await selectStateNamesForSearch(this.db);
    const match = bestMatch(name, searchRows, r => r.name);
    if (!match) return null;

    const [[regionMap, subregionMap], countryRow, stateRows] = await Promise.all([
      this.loadLookups(),
      selectCountryById(this.db, match.country_id),
      selectStatesByCountryId(this.db, match.country_id),
    ]);
    if (!countryRow) return null;

    if (!stateRows.length) return toCountryEntity(countryRow, [], regionMap, subregionMap);

    const cities = await selectCitiesByStateIds(
      this.db,
      stateRows.map(s => s.id),
    );
    const states = stateRows.map(s => toStateEntity(s, cities.get(s.id) ?? []));
    return toCountryEntity(countryRow, states, regionMap, subregionMap);
  }

  // ── Private ─────────────────────────────────────────────────

  /** Load and cache region/subregion lookup maps (static data, loaded once). */
  private async loadLookups(): Promise<[Map<number, RegionEntity>, Map<number, SubregionEntity>]> {
    if (this.lookupsCache) return this.lookupsCache;

    const [regionRows, subregionRows] = await Promise.all([selectAllRegions(this.db), selectAllSubregions(this.db)]);

    const regionMap = new Map(regionRows.map(r => [r.id, toRegionEntity(r)]));
    const subregionMap = new Map(subregionRows.map(r => [r.id, toSubregionEntity(r)]));

    this.lookupsCache = [regionMap, subregionMap];
    return this.lookupsCache;
  }
}
