import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import BetterSqlite3 from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { Database } from './database.types';

export const DATABASE_TOKEN = 'DATABASE_CONNECTION';

export const DatabaseProvider: Provider = {
  provide: DATABASE_TOKEN,
  inject: [ConfigService],
  useFactory: (config: ConfigService): Kysely<Database> => {
    const dbPath = config.get<string>('DATABASE_PATH', './data/countries.db');

    const dialect = new SqliteDialect({
      database: new BetterSqlite3(dbPath),
    });

    return new Kysely<Database>({ dialect });
  },
};
