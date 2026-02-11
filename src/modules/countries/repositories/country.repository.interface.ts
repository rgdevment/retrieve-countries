import { ExcludeOptions } from '../../../common/interfaces/exclude-options.interface';

export interface CountryRow {
  name: string;
  capital: string | null;
  code: string;
  iso3: string | null;
  phone_code: string | null;
  region: string | null;
  subregion: string | null;
  latitude: number | null;
  longitude: number | null;
  tld: string | null;
  currency_code: string | null;
  currency_symbol: string | null;
  currency_name: string | null;
  flag_ico: string | null;
  flag_alt: string | null;
  flag_png: string | null;
  flag_svg: string | null;
}

export interface StateRow {
  name: string;
  code: string | null;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
}

export interface CityRow {
  name: string;
  state_code: string | null;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
}

export interface CountryWithRelations extends CountryRow {
  states?: StateRow[];
  cities?: CityRow[];
}

export interface CountryRepository {
  findAll(options: ExcludeOptions): Promise<CountryWithRelations[]>;
  findOneBy(field: string, value: string, options: ExcludeOptions): Promise<CountryWithRelations | null>;
  findAllBy(field: string, value: string, options: ExcludeOptions): Promise<CountryWithRelations[]>;
}
