import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { CountryRow, Database, DATABASE_TOKEN, StateRow } from '../../../database';
import { CityRecord, CountryRecord, CountryRepository, StateRecord } from './country.repository.interface';

@Injectable()
export class CountryRepositorySqlite implements CountryRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>) {}

  /** List — 1 query, no states/cities. */
  async findAll(): Promise<CountryRecord[]> {
    const rows = await this.db.selectFrom('countries').selectAll().execute();
    return rows.map(r => this.toCountry(r, []));
  }

  /** Detail — 3 queries (country + states + cities). */
  async findByName(name: string): Promise<CountryRecord | null> {
    const row = await this.db.selectFrom('countries').selectAll().where('name', '=', name).executeTakeFirst();

    if (!row) return null;

    const states = await this.loadStates(row.id);
    return this.toCountry(row, states);
  }

  /** State detail — 2 queries (state + cities). */
  async findStateByName(name: string): Promise<StateRecord | null> {
    const row = await this.db.selectFrom('states').selectAll().where('name', '=', name).executeTakeFirst();

    if (!row) return null;

    const cities = await this.loadCities([row.id]);
    return this.toState(row, cities.get(row.id) ?? []);
  }

  // ── Loaders ─────────────────────────────────────────────────

  private async loadStates(countryId: number): Promise<StateRecord[]> {
    const rows = await this.db.selectFrom('states').selectAll().where('country_id', '=', countryId).execute();

    if (!rows.length) return [];

    const cities = await this.loadCities(rows.map(s => s.id));
    return rows.map(s => this.toState(s, cities.get(s.id) ?? []));
  }

  private async loadCities(stateIds: number[]): Promise<Map<number, CityRecord[]>> {
    const rows = await this.db
      .selectFrom('cities')
      .select(['name', 'state_code', 'country_code', 'latitude', 'longitude', 'state_id'])
      .where('state_id', 'in', stateIds)
      .execute();

    const map = new Map<number, CityRecord[]>();
    for (const r of rows) {
      const list = map.get(r.state_id) ?? [];
      list.push({
        name: r.name,
        state_code: r.state_code,
        country_code: r.country_code,
        latitude: r.latitude,
        longitude: r.longitude,
      });
      map.set(r.state_id, list);
    }
    return map;
  }

  // ── Mappers (DB row → API record) ───────────────────────────

  private toCountry(r: CountryRow, states: StateRecord[]): CountryRecord {
    return {
      name: r.name,
      iso2: r.iso2 ?? '',
      iso3: r.iso3 ?? '',
      numeric_code: r.numeric_code ?? '',
      capital: r.capital ?? '',
      phonecode: r.phonecode ?? '',
      tld: r.tld ?? '',
      nationality: r.nationality ?? '',
      region: r.region ?? '',
      subregion: r.subregion ?? '',
      latitude: r.latitude ?? 0,
      longitude: r.longitude ?? 0,
      emoji: r.emoji ?? '',
      emojiU: r.emojiU ?? '',
      currency: { code: r.currency ?? '', name: r.currency_name ?? '', symbol: r.currency_symbol ?? '' },
      states,
    };
  }

  private toState(r: StateRow, cities: CityRecord[]): StateRecord {
    return {
      name: r.name,
      iso2: r.iso2 ?? '',
      type: r.type ?? '',
      country_code: r.country_code,
      latitude: r.latitude ?? 0,
      longitude: r.longitude ?? 0,
      cities,
    };
  }
}
