import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface CountryTable {
  id: Generated<number>;
  code: string;
  iso3: string | null;
  name: string;
  capital: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_code: string | null;
  region: string | null;
  subregion: string | null;
  tld: string | null;
  currency_code: string | null;
  currency_symbol: string | null;
  currency_name: string | null;
  flag_ico: string | null;
  flag_alt: string | null;
  flag_png: string | null;
  flag_svg: string | null;
  created_at: Generated<string>;
  updated_at: Generated<string>;
}

export interface StateTable {
  id: Generated<number>;
  name: string;
  code: string | null;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  created_at: Generated<string>;
  updated_at: Generated<string>;
}

export interface CityTable {
  id: Generated<number>;
  name: string;
  state_code: string | null;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  created_at: Generated<string>;
  updated_at: Generated<string>;
}

export interface Database {
  countries: CountryTable;
  states: StateTable;
  cities: CityTable;
}

export type Country = Selectable<CountryTable>;
export type NewCountry = Insertable<CountryTable>;
export type CountryUpdate = Updateable<CountryTable>;

export type State = Selectable<StateTable>;
export type NewState = Insertable<StateTable>;

export type City = Selectable<CityTable>;
export type NewCity = Insertable<CityTable>;
