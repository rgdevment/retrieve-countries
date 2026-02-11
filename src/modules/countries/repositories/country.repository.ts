import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { ExcludeOptions } from '../../../common/interfaces/exclude-options.interface';
import { Database, DATABASE_TOKEN } from '../../../database';
import { CountryRepository, CountryRow, CountryWithRelations } from './country.repository.interface';

@Injectable()
export class CountryRepositorySqlite implements CountryRepository {
  constructor(@Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>) {}

  async findAll(options: ExcludeOptions): Promise<CountryWithRelations[]> {
    const rows = await this.db.selectFrom('countries').selectAll().execute();

    return this.hydrateMany(rows, options);
  }

  async findOneBy(field: string, value: string, options: ExcludeOptions): Promise<CountryWithRelations | null> {
    const row = await this.db
      .selectFrom('countries')
      .selectAll()
      .where(field as keyof Database['countries'], '=', value)
      .executeTakeFirst();

    if (!row) return null;

    return this.hydrateOne(row, options);
  }

  async findAllBy(field: string, value: string, options: ExcludeOptions): Promise<CountryWithRelations[]> {
    const rows = await this.db
      .selectFrom('countries')
      .selectAll()
      .where(field as keyof Database['countries'], '=', value)
      .execute();

    return this.hydrateMany(rows, options);
  }

  private async hydrateMany(rows: CountryRow[], options: ExcludeOptions): Promise<CountryWithRelations[]> {
    return Promise.all(rows.map(row => this.hydrateOne(row, options)));
  }

  private async hydrateOne(row: CountryRow, options: ExcludeOptions): Promise<CountryWithRelations> {
    const result: CountryWithRelations = { ...row };

    if (!options.excludeStates) {
      result.states = await this.db
        .selectFrom('states')
        .select(['name', 'code', 'country_code', 'latitude', 'longitude'])
        .where('country_code', '=', row.code)
        .execute();
    }

    if (!options.excludeCities) {
      result.cities = await this.db
        .selectFrom('cities')
        .select(['name', 'state_code', 'country_code', 'latitude', 'longitude'])
        .where('country_code', '=', row.code)
        .execute();
    }

    return result;
  }
}
