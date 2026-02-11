import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, sql } from 'kysely';
import { DATABASE_TOKEN } from './database.provider';
import { Database } from './database.types';

/**
 * Ensures the SQLite database is ready on every application boot.
 *
 * - **development**: creates tables + indexes if the DB is empty.
 * - **production**: validates tables exist; fails fast if they don't.
 * - **always** (dev & prod): ensures all indexes exist on every boot.
 */
@Injectable()
export class DatabaseInitializer implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitializer.name);
  private readonly isProd: boolean;

  constructor(
    @Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>,
    private readonly config: ConfigService,
  ) {
    this.isProd = this.config.get<string>('NODE_ENV') === 'production';
  }

  async onModuleInit(): Promise<void> {
    const hasSchema = await this.tablesExist();

    if (!hasSchema) {
      if (this.isProd) {
        throw new Error(
          'Database schema not found. In production the database must be pre-provisioned. ' +
            `Check DATABASE_PATH (${this.config.get<string>('DATABASE_PATH')}).`,
        );
      }

      this.logger.log('Development mode — creating database schema…');
      await this.createSchema();
      this.logger.log('Database schema created successfully.');
    } else {
      this.logger.log('Database schema verified — tables exist.');
    }

    // Always ensure indexes on every boot (dev & prod)
    await this.ensureIndexes();
    this.logger.log('Database indexes verified.');
  }

  // ── Schema creation ──────────────────────────────────────────

  private async createSchema(): Promise<void> {
    // 1. Regions (No dependencies)
    await sql`
      CREATE TABLE "regions" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(100) NOT NULL,
        "translations" TEXT NULL,
        "created_at" DATETIME NULL,
        "updated_at" DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        "flag" TINYINT NOT NULL DEFAULT '1',
        "wikiDataId" VARCHAR(255) NULL
      )
    `.execute(this.db);

    // 2. Subregions (Depends on regions)
    await sql`
      CREATE TABLE "subregions" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(100) NOT NULL,
        "translations" TEXT NULL,
        "region_id" MEDIUMINT NOT NULL,
        "created_at" DATETIME NULL,
        "updated_at" DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        "flag" TINYINT NOT NULL DEFAULT '1',
        "wikiDataId" VARCHAR(255) NULL,
        FOREIGN KEY("region_id") REFERENCES "regions" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
      )
    `.execute(this.db);

    // 3. Countries (Depends on regions and subregions)
    await sql`
      CREATE TABLE "countries" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(100) NOT NULL,
        "iso3" CHARACTER(3) NULL,
        "numeric_code" CHARACTER(3) NULL,
        "iso2" CHARACTER(2) NULL,
        "phonecode" VARCHAR(255) NULL,
        "capital" VARCHAR(255) NULL,
        "currency" VARCHAR(255) NULL,
        "currency_name" VARCHAR(255) NULL,
        "currency_symbol" VARCHAR(255) NULL,
        "tld" VARCHAR(255) NULL,
        "native" VARCHAR(255) NULL,
        "region" VARCHAR(255) NULL,
        "region_id" MEDIUMINT NULL,
        "subregion" VARCHAR(255) NULL,
        "subregion_id" MEDIUMINT NULL,
        "nationality" VARCHAR(255) NULL,
        "timezones" TEXT NULL,
        "translations" TEXT NULL,
        "latitude" DECIMAL NULL,
        "longitude" DECIMAL NULL,
        "emoji" VARCHAR(191) NULL,
        "emojiU" VARCHAR(191) NULL,
        "created_at" DATETIME NULL,
        "updated_at" DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        "flag" TINYINT NOT NULL DEFAULT '1',
        "wikiDataId" VARCHAR(255) NULL,
        FOREIGN KEY("region_id") REFERENCES "regions" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
        FOREIGN KEY("subregion_id") REFERENCES "subregions" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
      )
    `.execute(this.db);

    // 4. States (Depends on countries)
    await sql`
      CREATE TABLE "states" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(255) NOT NULL,
        "country_id" MEDIUMINT NOT NULL,
        "country_code" CHARACTER(2) NOT NULL,
        "fips_code" VARCHAR(255) NULL,
        "iso2" VARCHAR(255) NULL,
        "type" VARCHAR(191) NULL,
        "level" INTEGER NULL,
        "parent_id" INTEGER NULL,
        "native" VARCHAR(255) NULL,
        "latitude" DECIMAL NULL,
        "longitude" DECIMAL NULL,
        "created_at" DATETIME NULL,
        "updated_at" DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        "flag" TINYINT NOT NULL DEFAULT '1',
        "wikiDataId" VARCHAR(255) NULL,
        FOREIGN KEY("country_id") REFERENCES "countries" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
      )
    `.execute(this.db);

    // 5. Cities (Depends on states and countries)
    await sql`
      CREATE TABLE "cities" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(255) NOT NULL,
        "state_id" MEDIUMINT NOT NULL,
        "state_code" VARCHAR(255) NOT NULL,
        "country_id" MEDIUMINT NOT NULL,
        "country_code" CHARACTER(2) NOT NULL,
        "latitude" DECIMAL NOT NULL,
        "longitude" DECIMAL NOT NULL,
        "created_at" DATETIME NOT NULL DEFAULT '2014-01-01 12:01:01',
        "updated_at" DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        "flag" TINYINT NOT NULL DEFAULT '1',
        "wikiDataId" VARCHAR(255) NULL,
        FOREIGN KEY("state_id") REFERENCES "states" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
        FOREIGN KEY("country_id") REFERENCES "countries" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
      )
    `.execute(this.db);
  }

  // ── Index management (runs on EVERY boot) ───────────────────

  private async ensureIndexes(): Promise<void> {
    // FK indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_subregions_region_id   ON subregions(region_id)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_countries_region_id    ON countries(region_id)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_countries_subregion_id ON countries(subregion_id)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_states_country_id      ON states(country_id)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_state_id        ON cities(state_id)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_country_id      ON cities(country_id)`.execute(this.db);

    // Name lookups (COLLATE NOCASE for case-insensitive queries)
    await sql`CREATE INDEX IF NOT EXISTS idx_regions_name    ON regions(name COLLATE NOCASE)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_subregions_name ON subregions(name COLLATE NOCASE)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_countries_name  ON countries(name COLLATE NOCASE)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_states_name     ON states(name COLLATE NOCASE)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_name     ON cities(name COLLATE NOCASE)`.execute(this.db);

    // Common query patterns
    await sql`CREATE INDEX IF NOT EXISTS idx_countries_capital ON countries(capital COLLATE NOCASE)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_countries_iso2    ON countries(iso2)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_countries_iso3    ON countries(iso3)`.execute(this.db);
    await sql`CREATE INDEX IF NOT EXISTS idx_states_code       ON states(country_code)`.execute(this.db);
  }

  // ── Validation ──────────────────────────────────────────────

  private async tablesExist(): Promise<boolean> {
    const requiredTables = ['regions', 'subregions', 'countries', 'states', 'cities'];

    const result = await sql<{ cnt: number }>`
      SELECT COUNT(*) as cnt
      FROM sqlite_master
      WHERE type = 'table'
        AND name IN (${sql.join(requiredTables)})
    `.execute(this.db);

    return (result.rows[0]?.cnt ?? 0) === requiredTables.length;
  }
}
