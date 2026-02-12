import { Kysely } from 'kysely';
import { Database } from '../../../database';
import { CityRow, CountryRow, RegionRow, StateRow, SubregionRow } from '../../../database/database.types';
import { CityEntity } from '../entities';

export interface CountrySearchRow {
  readonly id: number;
  readonly name: string;
  readonly iso2: string | null;
  readonly iso3: string | null;
  readonly emoji: string | null;
}

export interface StateSearchRow {
  readonly id: number;
  readonly name: string;
  readonly iso2: string | null;
  readonly country_id: number;
}

export interface CitySearchRow {
  readonly id: number;
  readonly name: string;
  readonly state_id: number;
  readonly country_id: number;
}

export function selectAllRegions(db: Kysely<Database>): Promise<RegionRow[]> {
  return db.selectFrom('regions').selectAll().execute();
}

export function selectAllSubregions(db: Kysely<Database>): Promise<SubregionRow[]> {
  return db.selectFrom('subregions').selectAll().execute();
}

export function selectAllCountries(db: Kysely<Database>): Promise<CountryRow[]> {
  return db.selectFrom('countries').selectAll().execute();
}

export function selectCountryNamesForSearch(db: Kysely<Database>): Promise<CountrySearchRow[]> {
  return db.selectFrom('countries').select(['id', 'name', 'iso2', 'iso3', 'emoji']).execute();
}

export function selectCountryById(db: Kysely<Database>, id: number): Promise<CountryRow | undefined> {
  return db.selectFrom('countries').selectAll().where('id', '=', id).executeTakeFirst();
}

export function selectCountryByIso2(db: Kysely<Database>, iso2: string): Promise<CountryRow | undefined> {
  return db.selectFrom('countries').selectAll().where('iso2', '=', iso2).executeTakeFirst();
}

export function selectCountryByIso3(db: Kysely<Database>, iso3: string): Promise<CountryRow | undefined> {
  return db.selectFrom('countries').selectAll().where('iso3', '=', iso3).executeTakeFirst();
}

export function selectCountriesByRegionId(db: Kysely<Database>, regionId: number): Promise<CountryRow[]> {
  return db.selectFrom('countries').selectAll().where('region_id', '=', regionId).execute();
}

export function selectCountriesBySubregionId(db: Kysely<Database>, subregionId: number): Promise<CountryRow[]> {
  return db.selectFrom('countries').selectAll().where('subregion_id', '=', subregionId).execute();
}

export function selectAllStates(db: Kysely<Database>): Promise<StateRow[]> {
  return db.selectFrom('states').selectAll().execute();
}

export function selectStateNamesForSearch(db: Kysely<Database>): Promise<StateSearchRow[]> {
  return db.selectFrom('states').select(['id', 'name', 'iso2', 'country_id']).execute();
}

export function selectStatesByCountryId(db: Kysely<Database>, countryId: number): Promise<StateRow[]> {
  return db.selectFrom('states').selectAll().where('country_id', '=', countryId).execute();
}

export function selectStatesByCountryIds(db: Kysely<Database>, countryIds: number[]): Promise<StateRow[]> {
  if (!countryIds.length) return Promise.resolve([]);
  return db.selectFrom('states').selectAll().where('country_id', 'in', countryIds).execute();
}

export function selectStateById(db: Kysely<Database>, id: number): Promise<StateRow | undefined> {
  return db.selectFrom('states').selectAll().where('id', '=', id).executeTakeFirst();
}

export function selectCityById(db: Kysely<Database>, id: number): Promise<CityRow | undefined> {
  return db.selectFrom('cities').selectAll().where('id', '=', id).executeTakeFirst();
}

export function selectCityNamesForSearch(db: Kysely<Database>): Promise<CitySearchRow[]> {
  return db.selectFrom('cities').select(['id', 'name', 'state_id', 'country_id']).execute();
}

interface CityQueryRow {
  readonly id: number;
  readonly name: string;
  readonly state_code: string;
  readonly country_code: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly wikiDataId: string | null;
}

function toCityFromRow(r: CityQueryRow): CityEntity {
  return {
    id: r.id,
    name: r.name,
    state_code: r.state_code,
    country_code: r.country_code,
    latitude: r.latitude,
    longitude: r.longitude,
    wikiDataId: r.wikiDataId ?? '',
  };
}

export async function selectCitiesByStateId(db: Kysely<Database>, stateId: number): Promise<CityEntity[]> {
  const rows = await db
    .selectFrom('cities')
    .select(['id', 'name', 'state_code', 'country_code', 'latitude', 'longitude', 'wikiDataId'])
    .where('state_id', '=', stateId)
    .execute();

  return rows.map(toCityFromRow);
}

export async function selectCitiesByStateIds(
  db: Kysely<Database>,
  stateIds: number[],
): Promise<Map<number, CityEntity[]>> {
  if (!stateIds.length) return new Map();

  const rows = await db
    .selectFrom('cities')
    .select(['id', 'name', 'state_code', 'country_code', 'latitude', 'longitude', 'wikiDataId', 'state_id'])
    .where('state_id', 'in', stateIds)
    .execute();

  const map = new Map<number, CityEntity[]>();
  for (const r of rows) {
    const list = map.get(r.state_id) ?? [];
    list.push(toCityFromRow(r));
    map.set(r.state_id, list);
  }
  return map;
}
