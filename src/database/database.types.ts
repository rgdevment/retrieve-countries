import type { Generated, Insertable, Selectable } from 'kysely';

// ─── Table definitions ──────────────────────────────────────

export interface RegionTable {
  id: Generated<number>;
  name: string;
  translations: string | null;
  created_at: string | null;
  updated_at: string;
  flag: number;
  wikiDataId: string | null;
}

export interface SubregionTable {
  id: Generated<number>;
  name: string;
  translations: string | null;
  region_id: number;
  created_at: string | null;
  updated_at: string;
  flag: number;
  wikiDataId: string | null;
}

export interface CountryTable {
  id: Generated<number>;
  name: string;
  iso3: string | null;
  numeric_code: string | null;
  iso2: string | null;
  phonecode: string | null;
  capital: string | null;
  currency: string | null;
  currency_name: string | null;
  currency_symbol: string | null;
  tld: string | null;
  native: string | null;
  region: string | null;
  region_id: number | null;
  subregion: string | null;
  subregion_id: number | null;
  nationality: string | null;
  timezones: string | null;
  translations: string | null;
  latitude: number | null;
  longitude: number | null;
  emoji: string | null;
  emojiU: string | null;
  created_at: string | null;
  updated_at: string;
  flag: number;
  wikiDataId: string | null;
}

export interface StateTable {
  id: Generated<number>;
  name: string;
  country_id: number;
  country_code: string;
  fips_code: string | null;
  iso2: string | null;
  type: string | null;
  level: number | null;
  parent_id: number | null;
  native: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string | null;
  updated_at: string;
  flag: number;
  wikiDataId: string | null;
}

export interface CityTable {
  id: Generated<number>;
  name: string;
  state_id: number;
  state_code: string;
  country_id: number;
  country_code: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  flag: number;
  wikiDataId: string | null;
}

// ─── Database map ────────────────────────────────────────────

export interface Database {
  regions: RegionTable;
  subregions: SubregionTable;
  countries: CountryTable;
  states: StateTable;
  cities: CityTable;
}

// ─── Row types (what comes out of SELECT) ────────────────────

export type RegionRow = Selectable<RegionTable>;
export type SubregionRow = Selectable<SubregionTable>;
export type CountryRow = Selectable<CountryTable>;
export type StateRow = Selectable<StateTable>;
export type CityRow = Selectable<CityTable>;

// ─── Insert types ────────────────────────────────────────────

export type NewRegion = Insertable<RegionTable>;
export type NewSubregion = Insertable<SubregionTable>;
export type NewCountry = Insertable<CountryTable>;
export type NewState = Insertable<StateTable>;
export type NewCity = Insertable<CityTable>;
