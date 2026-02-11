// ─── API shapes (what the repo returns) ──────────────────────

export interface CityRecord {
  name: string;
  state_code: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

export interface StateRecord {
  name: string;
  iso2: string;
  type: string;
  country_code: string;
  latitude: number;
  longitude: number;
  cities: CityRecord[];
}

export interface CurrencyRecord {
  code: string;
  name: string;
  symbol: string;
}

export interface CountryRecord {
  name: string;
  iso2: string;
  iso3: string;
  numeric_code: string;
  capital: string;
  phonecode: string;
  tld: string;
  nationality: string;
  region: string;
  subregion: string;
  latitude: number;
  longitude: number;
  emoji: string;
  emojiU: string;
  currency: CurrencyRecord;
  states: StateRecord[];
}

// ─── Repository contract ─────────────────────────────────────

export interface CountryRepository {
  findAll(): Promise<CountryRecord[]>;
  findByName(name: string): Promise<CountryRecord | null>;
  findStateByName(name: string): Promise<StateRecord | null>;
}
