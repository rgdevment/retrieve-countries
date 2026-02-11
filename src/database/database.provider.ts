import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BetterSqlite3 from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { Database } from './database.types';

export const DATABASE_TOKEN = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_TOKEN,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Kysely<Database> => {
    const dbPath = config.get<string>('DATABASE_PATH', './data/world.sqlite3');
    const logger = new Logger('DatabaseProvider');

    const native = new BetterSqlite3(dbPath);

    // SQLite best-practices for a read-heavy workload
    native.pragma('journal_mode = WAL');
    native.pragma('foreign_keys = ON');
    native.pragma('busy_timeout = 5000');
    native.pragma('synchronous = NORMAL');
    native.pragma('cache_size = -20000');
    native.pragma('temp_store = MEMORY');

    logger.log(`SQLite connected → ${dbPath}`);

    return new Kysely<Database>({ dialect: new SqliteDialect({ database: native }) });
  },
};
