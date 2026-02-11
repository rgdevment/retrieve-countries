import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DATABASE_TOKEN } from './database.provider';
import { Database } from './database.types';

@Injectable()
export class DatabaseMigration implements OnModuleInit {
  private readonly logger = new Logger(DatabaseMigration.name);

  constructor(@Inject(DATABASE_TOKEN) private readonly db: Kysely<Database>) {}

  async onModuleInit(): Promise<void> {
    await this.migrate();
  }

  private async migrate(): Promise<void> {
    this.logger.log('Running database migrations...');

    await this.db.schema
      .createTable('countries')
      .ifNotExists()
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('code', 'varchar(5)', col => col.notNull().unique())
      .addColumn('iso3', 'varchar(5)')
      .addColumn('name', 'varchar(128)', col => col.notNull())
      .addColumn('capital', 'varchar(128)')
      .addColumn('latitude', 'real')
      .addColumn('longitude', 'real')
      .addColumn('phone_code', 'varchar(16)')
      .addColumn('region', 'varchar(64)')
      .addColumn('subregion', 'varchar(64)')
      .addColumn('tld', 'varchar(16)')
      .addColumn('currency_code', 'varchar(10)')
      .addColumn('currency_symbol', 'varchar(10)')
      .addColumn('currency_name', 'varchar(64)')
      .addColumn('flag_ico', 'varchar(8)')
      .addColumn('flag_alt', 'text')
      .addColumn('flag_png', 'text')
      .addColumn('flag_svg', 'text')
      .addColumn('created_at', 'text', col => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at', 'text', col => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .execute();

    await this.db.schema
      .createTable('states')
      .ifNotExists()
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('name', 'varchar(128)', col => col.notNull())
      .addColumn('code', 'varchar(10)')
      .addColumn('country_code', 'varchar(5)', col =>
        col.notNull().references('countries.code').onDelete('cascade').onUpdate('cascade'),
      )
      .addColumn('latitude', 'real')
      .addColumn('longitude', 'real')
      .addColumn('created_at', 'text', col => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at', 'text', col => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .execute();

    await this.db.schema
      .createTable('cities')
      .ifNotExists()
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('name', 'varchar(128)', col => col.notNull())
      .addColumn('state_code', 'varchar(10)')
      .addColumn('country_code', 'varchar(5)', col =>
        col.notNull().references('countries.code').onDelete('cascade').onUpdate('cascade'),
      )
      .addColumn('latitude', 'real')
      .addColumn('longitude', 'real')
      .addColumn('created_at', 'text', col => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .addColumn('updated_at', 'text', col => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
      .execute();

    // Create indexes for common queries
    await this.db.schema.createIndex('idx_countries_name').ifNotExists().on('countries').column('name').execute();

    await this.db.schema.createIndex('idx_countries_capital').ifNotExists().on('countries').column('capital').execute();

    await this.db.schema.createIndex('idx_countries_region').ifNotExists().on('countries').column('region').execute();

    await this.db.schema
      .createIndex('idx_countries_subregion')
      .ifNotExists()
      .on('countries')
      .column('subregion')
      .execute();

    await this.db.schema
      .createIndex('idx_states_country_code')
      .ifNotExists()
      .on('states')
      .column('country_code')
      .execute();

    await this.db.schema
      .createIndex('idx_cities_country_code')
      .ifNotExists()
      .on('cities')
      .column('country_code')
      .execute();

    this.logger.log('Database migrations completed.');
  }
}
