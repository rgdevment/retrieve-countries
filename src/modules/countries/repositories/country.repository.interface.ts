import { CityEntity, CountryEntity, CountrySimpleEntity, StateEntity } from '../entities';

// ── Hierarchy control ─────────────────────────────────────────

export interface HierarchyOptions {
  readonly includeStates: boolean;
  readonly includeCities: boolean;
}

// ── Search result types ───────────────────────────────────────

export interface StateSearchItem {
  readonly id: number;
  readonly name: string;
  readonly iso2: string;
  readonly country_name: string;
  readonly country_iso2: string;
}

export interface CitySearchItem {
  readonly id: number;
  readonly name: string;
  readonly state_name: string;
  readonly country_name: string;
  readonly country_iso2: string;
}

export interface SearchResult {
  readonly countries: CountrySimpleEntity[];
  readonly states: StateSearchItem[];
  readonly cities: CitySearchItem[];
}

// ── Repository contract ───────────────────────────────────────

export interface CountryRepository {
  /** List all countries with hierarchy depth controlled by options. */
  findAll(options: HierarchyOptions): Promise<CountryEntity[]>;

  /** Smart resolve: find a country by numeric ID, ISO2, ISO3, or name. */
  findByTerm(term: string, options: HierarchyOptions): Promise<CountryEntity | null>;

  /** Filter countries by region/continent name. */
  findByRegion(name: string, options: HierarchyOptions): Promise<CountryEntity[]>;

  /** Filter countries by subregion name. */
  findBySubregion(name: string, options: HierarchyOptions): Promise<CountryEntity[]>;

  /** Get a single state by ID, optionally including its cities. */
  findStateById(id: number, includeCities: boolean): Promise<StateEntity | null>;

  /** Get a single city by ID. */
  findCityById(id: number): Promise<CityEntity | null>;

  /** Global search across countries, states, and cities. */
  search(query: string, limit: number): Promise<SearchResult>;
}
