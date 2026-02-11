import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { CountryRow, Database, DATABASE_TOKEN } from '../../../database';
import { CityResult, CountryRepository, CountryResult, StateResult } from './country.repository.interface';

@Injectable()
export class CountryRepositorySqlite implements CountryRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>) {}

  async findAll(): Promise<CountryResult[]> {
    const rows = await this.db.selectFrom('countries').selectAll().execute();
    return this.hydrateMany(rows);
  }

  async findByName(name: string): Promise<CountryResult | null> {
    const row = await this.db.selectFrom('countries').selectAll().where('name', '=', name).executeTakeFirst();
    if (!row) return null;

    const states = await this.loadRelationsForCountry(row.id);
    return { country: row, states };
  }

  async findStateByName(name: string): Promise<StateResult | null> {
    const state = await this.db.selectFrom('states').selectAll().where('name', '=', name).executeTakeFirst();
    if (!state) return null;

    // Direct query — state_code/country_code are on the cities table, no JOIN needed
    const cities = await this.db
      .selectFrom('cities')
      .select(['name', 'state_code', 'country_code', 'latitude', 'longitude'])
      .where('state_id', '=', state.id)
      .execute();

    return {
      name: state.name,
      iso2: state.iso2,
      type: state.type,
      country_code: state.country_code,
      latitude: state.latitude,
      longitude: state.longitude,
      cities,
    };
  }

  // ── Batch hydration (3 queries total, avoids N+1) ───────────

  private async hydrateMany(rows: CountryRow[]): Promise<CountryResult[]> {
    if (!rows.length) return [];

    const countryIds = rows.map(r => r.id);

    // 1 query → all states
    const allStates = await this.db.selectFrom('states').selectAll().where('country_id', 'in', countryIds).execute();

    // 1 query → all cities — NO JOIN needed, state_code is denormalized
    const allCities = await this.db
      .selectFrom('cities')
      .select(['name', 'state_code', 'country_code', 'latitude', 'longitude', 'state_id'])
      .where('country_id', 'in', countryIds)
      .execute();

    // Group cities by state_id
    const citiesByState = new Map<number, CityResult[]>();
    for (const c of allCities) {
      const list = citiesByState.get(c.state_id) ?? [];
      list.push({
        name: c.name,
        state_code: c.state_code,
        country_code: c.country_code,
        latitude: c.latitude,
        longitude: c.longitude,
      });
      citiesByState.set(c.state_id, list);
    }

    // Group states by country_id, attach their cities
    const statesByCountry = new Map<number, StateResult[]>();
    for (const s of allStates) {
      const list = statesByCountry.get(s.country_id) ?? [];
      list.push({
        name: s.name,
        iso2: s.iso2,
        type: s.type,
        country_code: s.country_code,
        latitude: s.latitude,
        longitude: s.longitude,
        cities: citiesByState.get(s.id) ?? [],
      });
      statesByCountry.set(s.country_id, list);
    }

    return rows.map(row => ({ country: row, states: statesByCountry.get(row.id) ?? [] }));
  }

  // ── Single-country batch loader (2 queries, no N+1) ─────────

  private async loadRelationsForCountry(countryId: number): Promise<StateResult[]> {
    const stateRows = await this.db.selectFrom('states').selectAll().where('country_id', '=', countryId).execute();

    if (!stateRows.length) return [];

    const stateIds = stateRows.map(s => s.id);

    // 1 query for all cities of all states — no JOIN
    const cityRows = await this.db
      .selectFrom('cities')
      .select(['name', 'state_code', 'country_code', 'latitude', 'longitude', 'state_id'])
      .where('state_id', 'in', stateIds)
      .execute();

    const citiesByState = new Map<number, CityResult[]>();
    for (const c of cityRows) {
      const list = citiesByState.get(c.state_id) ?? [];
      list.push({
        name: c.name,
        state_code: c.state_code,
        country_code: c.country_code,
        latitude: c.latitude,
        longitude: c.longitude,
      });
      citiesByState.set(c.state_id, list);
    }

    return stateRows.map(s => ({
      name: s.name,
      iso2: s.iso2,
      type: s.type,
      country_code: s.country_code,
      latitude: s.latitude,
      longitude: s.longitude,
      cities: citiesByState.get(s.id) ?? [],
    }));
  }
}
