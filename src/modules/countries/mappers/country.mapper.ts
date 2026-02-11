import { CountryRow, RegionRow, StateRow, SubregionRow } from '../../../database';
import { CityEntity, CountryEntity, RegionEntity, StateEntity, SubregionEntity, TimezoneEntry } from '../entities';

// ── Null coalescing helpers ─────────────────────────────────

const s = (v: string | null): string => v ?? '';
const n = (v: number | null): number => v ?? 0;

/** Parse a JSON text column into a typed object, returning null on failure. */
function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ── DB Row → Entity mappers ─────────────────────────────────

export function toRegionEntity(row: RegionRow): RegionEntity {
  return {
    name: row.name,
    translations: parseJson<Record<string, string>>(row.translations),
    wikiDataId: s(row.wikiDataId),
  };
}

export function toSubregionEntity(row: SubregionRow): SubregionEntity {
  return {
    name: row.name,
    translations: parseJson<Record<string, string>>(row.translations),
    wikiDataId: s(row.wikiDataId),
  };
}

const EMPTY_REGION: RegionEntity = { name: '', translations: null, wikiDataId: '' };
const EMPTY_SUBREGION: SubregionEntity = { name: '', translations: null, wikiDataId: '' };

export function toCountryEntity(
  row: CountryRow,
  states: StateEntity[],
  regionMap: Map<number, RegionEntity>,
  subregionMap: Map<number, SubregionEntity>,
): CountryEntity {
  return {
    name: row.name,
    iso2: s(row.iso2),
    iso3: s(row.iso3),
    numeric_code: s(row.numeric_code),
    capital: s(row.capital),
    phonecode: s(row.phonecode),
    tld: s(row.tld),
    native: s(row.native),
    nationality: s(row.nationality),
    region: row.region_id ? (regionMap.get(row.region_id) ?? EMPTY_REGION) : EMPTY_REGION,
    subregion: row.subregion_id ? (subregionMap.get(row.subregion_id) ?? EMPTY_SUBREGION) : EMPTY_SUBREGION,
    latitude: n(row.latitude),
    longitude: n(row.longitude),
    emoji: s(row.emoji),
    emojiU: s(row.emojiU),
    timezones: parseJson<TimezoneEntry[]>(row.timezones) ?? [],
    translations: parseJson<Record<string, string>>(row.translations),
    wikiDataId: s(row.wikiDataId),
    currency: { code: s(row.currency), name: s(row.currency_name), symbol: s(row.currency_symbol) },
    states,
  };
}

export function toStateEntity(row: StateRow, cities: CityEntity[]): StateEntity {
  return {
    name: row.name,
    iso2: s(row.iso2),
    type: s(row.type),
    country_code: row.country_code,
    fips_code: s(row.fips_code),
    level: row.level,
    parent_id: row.parent_id,
    native: s(row.native),
    latitude: n(row.latitude),
    longitude: n(row.longitude),
    wikiDataId: s(row.wikiDataId),
    cities,
  };
}
