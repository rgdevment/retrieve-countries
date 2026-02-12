import { CityEntity, CountryEntity, CountrySimpleEntity, StateEntity } from '../entities';

export interface HierarchyOptions {
  readonly includeStates: boolean;
  readonly includeCities: boolean;
}

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

export interface CountryRepository {
  findAll(options: HierarchyOptions): Promise<CountryEntity[]>;
  findByTerm(term: string, options: HierarchyOptions): Promise<CountryEntity | null>;
  findByRegion(name: string, options: HierarchyOptions): Promise<CountryEntity[]>;
  findBySubregion(name: string, options: HierarchyOptions): Promise<CountryEntity[]>;
  findStateById(id: number, includeCities: boolean): Promise<StateEntity | null>;
  findCityById(id: number): Promise<CityEntity | null>;
  search(query: string, limit: number): Promise<SearchResult>;
}
