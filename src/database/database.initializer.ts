import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DATABASE_TOKEN } from './database.provider';
import { Database } from './database.types';

@Injectable()
export class DatabaseInitializer implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitializer.name);

  constructor(@Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>) {}

  async onModuleInit(): Promise<void> {
    await this.validateSchema();

    if (process.env.NODE_ENV === 'production') {
      await this.verifyIndexes();
    } else {
      await this.ensureIndexes();
    }

    this.logger.log('Database validated — schema and indexes OK.');
  }

  private async validateSchema(): Promise<void> {
    const required = ['regions', 'subregions', 'countries', 'states', 'cities'];

    const result = await sql<{ name: string }>`
      SELECT name FROM sqlite_master
      WHERE type = 'table' AND name IN (${sql.join(required)})
    `.execute(this.db);

    const found = new Set(result.rows.map(r => r.name));
    const missing = required.filter(t => !found.has(t));

    if (missing.length) {
      throw new Error(
        `Database is missing tables: ${missing.join(', ')}. ` +
          'The database must be pre-provisioned with the correct schema.',
      );
    }
  }

  private async ensureIndexes(): Promise<void> {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_subregions_region_id   ON subregions(region_id)',
      'CREATE INDEX IF NOT EXISTS idx_countries_region_id    ON countries(region_id)',
      'CREATE INDEX IF NOT EXISTS idx_countries_subregion_id ON countries(subregion_id)',
      'CREATE INDEX IF NOT EXISTS idx_states_country_id      ON states(country_id)',
      'CREATE INDEX IF NOT EXISTS idx_cities_state_id        ON cities(state_id)',
      'CREATE INDEX IF NOT EXISTS idx_cities_country_id      ON cities(country_id)',
      'CREATE INDEX IF NOT EXISTS idx_regions_name    ON regions(name COLLATE NOCASE)',
      'CREATE INDEX IF NOT EXISTS idx_subregions_name ON subregions(name COLLATE NOCASE)',
      'CREATE INDEX IF NOT EXISTS idx_countries_name  ON countries(name COLLATE NOCASE)',
      'CREATE INDEX IF NOT EXISTS idx_states_name     ON states(name COLLATE NOCASE)',
      'CREATE INDEX IF NOT EXISTS idx_cities_name     ON cities(name COLLATE NOCASE)',
      'CREATE INDEX IF NOT EXISTS idx_countries_capital ON countries(capital COLLATE NOCASE)',
      'CREATE INDEX IF NOT EXISTS idx_countries_iso2    ON countries(iso2)',
      'CREATE INDEX IF NOT EXISTS idx_countries_iso3    ON countries(iso3)',
      'CREATE INDEX IF NOT EXISTS idx_states_code       ON states(country_code)',
    ];

    for (const ddl of indexes) {
      await sql.raw(ddl).execute(this.db);
    }
  }

  private async verifyIndexes(): Promise<void> {
    const expected = [
      'idx_subregions_region_id',
      'idx_countries_region_id',
      'idx_countries_subregion_id',
      'idx_states_country_id',
      'idx_cities_state_id',
      'idx_cities_country_id',
      'idx_regions_name',
      'idx_subregions_name',
      'idx_countries_name',
      'idx_states_name',
      'idx_cities_name',
      'idx_countries_capital',
      'idx_countries_iso2',
      'idx_countries_iso3',
      'idx_states_code',
    ];

    const result = await sql<{ name: string }>`
      SELECT name FROM sqlite_master WHERE type = 'index'
    `.execute(this.db);

    const found = new Set(result.rows.map(r => r.name));
    const missing = expected.filter(idx => !found.has(idx));

    if (missing.length) {
      throw new Error(
        `Database is missing indexes: ${missing.join(', ')}. ` +
          'Run the ensure-indexes script before starting in production.',
      );
    }
  }
}
