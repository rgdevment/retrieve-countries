import { CountryRow, StateRow } from '../../../database';

// ─── Shapes returned by the repository ───────────────────────

export interface CityResult {
  name: string;
  state_code: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

export interface StateResult extends Pick<
  StateRow,
  'name' | 'iso2' | 'type' | 'country_code' | 'latitude' | 'longitude'
> {
  cities: CityResult[];
}

export interface CountryResult {
  country: CountryRow;
  states: StateResult[];
}

// ─── Repository contract ─────────────────────────────────────

export interface CountryRepository {
  findAll(): Promise<CountryResult[]>;
  findByName(name: string): Promise<CountryResult | null>;
  findStateByName(name: string): Promise<StateResult | null>;
}
