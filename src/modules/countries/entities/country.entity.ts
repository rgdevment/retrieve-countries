import { CurrencyEntity } from './currency.entity';
import { RegionEntity } from './region.entity';
import { StateEntity } from './state.entity';
import { SubregionEntity } from './subregion.entity';

export interface TimezoneEntry {
  readonly zoneName: string;
  readonly gmtOffset: number;
  readonly gmtOffsetName: string;
  readonly abbreviation: string;
  readonly tzName: string;
}

export interface CountrySimpleEntity {
  readonly id: number;
  readonly name: string;
  readonly iso2: string;
  readonly emoji: string;
}

export interface CountryEntity {
  readonly id: number;
  readonly name: string;
  readonly iso2: string;
  readonly iso3: string;
  readonly numeric_code: string;
  readonly capital: string;
  readonly phonecode: string;
  readonly tld: string;
  readonly native: string;
  readonly nationality: string;
  readonly region: RegionEntity;
  readonly subregion: SubregionEntity;
  readonly latitude: number;
  readonly longitude: number;
  readonly emoji: string;
  readonly emojiU: string;
  readonly timezones: TimezoneEntry[];
  readonly translations: Record<string, string> | null;
  readonly wikiDataId: string;
  readonly currency: CurrencyEntity;
  readonly states: StateEntity[];
}
