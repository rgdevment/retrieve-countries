/**
 * Standalone script — opens SQLite in read-write mode,
 * creates indexes IF NOT EXISTS, then exits.
 *
 * Run BEFORE the server starts in production so the
 * main process can safely open the DB as readonly.
 */
import BetterSqlite3 from 'better-sqlite3';

const dbPath = process.env.DATABASE_PATH ?? './data/world.v3.sqlite3';

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

const db = new BetterSqlite3(dbPath);

db.pragma('journal_mode = WAL');

let created = 0;
for (const ddl of indexes) {
  db.exec(ddl);
  created++;
}

db.close();
console.log(`[ensure-indexes] ${created} indexes ensured on ${dbPath}`);
