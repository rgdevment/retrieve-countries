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
    const dbPath = config.getOrThrow<string>('DATABASE_PATH');
    const logger = new Logger('DatabaseProvider');

    const native = new BetterSqlite3(dbPath);

    native.pragma(`journal_mode = ${config.getOrThrow('SQLITE_JOURNAL_MODE')}`);
    native.pragma('foreign_keys = ON');
    native.pragma(`busy_timeout = ${config.getOrThrow('SQLITE_BUSY_TIMEOUT')}`);
    native.pragma(`synchronous = ${config.getOrThrow('SQLITE_SYNCHRONOUS')}`);
    native.pragma(`cache_size = ${config.getOrThrow('SQLITE_CACHE_SIZE')}`);
    native.pragma('temp_store = MEMORY');

    logger.log(`SQLite connected → ${dbPath}`);

    return new Kysely<Database>({ dialect: new SqliteDialect({ database: native }) });
  },
};
