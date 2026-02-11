import { Kysely } from 'kysely';
import { Database } from '../../../database';
import { CountryRow, RegionRow, StateRow, SubregionRow } from '../../../database/database.types';
import { CityEntity } from '../entities';

// ── Lean search types (used for bestMatch phase) ─────────────

export interface CountrySearchRow {
  readonly id: number;
  readonly name: string;
}

export interface StateSearchRow {
  readonly id: number;
  readonly name: string;
  readonly country_id: number;
}

// ── Region / Subregion ────────────────────────────────────────

/** Fetch all region rows. */
export function selectAllRegions(db: Kysely<Database>): Promise<RegionRow[]> {
  return db.selectFrom('regions').selectAll().execute();
}

/** Fetch all subregion rows. */
export function selectAllSubregions(db: Kysely<Database>): Promise<SubregionRow[]> {
  return db.selectFrom('subregions').selectAll().execute();
}

// ── Country ───────────────────────────────────────────────────

/** Fetch all country rows (full data for list endpoint). */
export function selectAllCountries(db: Kysely<Database>): Promise<CountryRow[]> {
  return db.selectFrom('countries').selectAll().execute();
}

/** Fetch only id + name for accent/case-insensitive search. */
export function selectCountryNamesForSearch(db: Kysely<Database>): Promise<CountrySearchRow[]> {
  return db.selectFrom('countries').select(['id', 'name']).execute();
}

/** Fetch a single country row by id. */
export function selectCountryById(db: Kysely<Database>, id: number): Promise<CountryRow | undefined> {
  return db.selectFrom('countries').selectAll().where('id', '=', id).executeTakeFirst();
}

// ── State ─────────────────────────────────────────────────────

/** Fetch all state rows (full data for list endpoint). */
export function selectAllStates(db: Kysely<Database>): Promise<StateRow[]> {
  return db.selectFrom('states').selectAll().execute();
}

/** Fetch only id + name + country_id for accent/case-insensitive search. */
export function selectStateNamesForSearch(db: Kysely<Database>): Promise<StateSearchRow[]> {
  return db.selectFrom('states').select(['id', 'name', 'country_id']).execute();
}

/** Fetch state rows for a single country. */
export function selectStatesByCountryId(db: Kysely<Database>, countryId: number): Promise<StateRow[]> {
  return db.selectFrom('states').selectAll().where('country_id', '=', countryId).execute();
}

// ── City ──────────────────────────────────────────────────────

/** Fetch cities grouped by state id. */
export async function selectCitiesByStateIds(
  db: Kysely<Database>,
  stateIds: number[],
): Promise<Map<number, CityEntity[]>> {
  if (!stateIds.length) return new Map();

  const rows = await db
    .selectFrom('cities')
    .select(['name', 'state_code', 'country_code', 'latitude', 'longitude', 'wikiDataId', 'state_id'])
    .where('state_id', 'in', stateIds)
    .execute();

  const map = new Map<number, CityEntity[]>();
  for (const r of rows) {
    const list = map.get(r.state_id) ?? [];
    list.push({
      name: r.name,
      state_code: r.state_code,
      country_code: r.country_code,
      latitude: r.latitude,
      longitude: r.longitude,
      wikiDataId: r.wikiDataId ?? '',
    });
    map.set(r.state_id, list);
  }
  return map;
}
