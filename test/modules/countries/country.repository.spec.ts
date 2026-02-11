import BetterSqlite3 from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { Database } from '../../../src/database/database.types';
import { CountryRepositorySqlite } from '../../../src/modules/countries/repositories/country.repository';

describe('CountryRepositorySqlite', () => {
  let db: Kysely<Database>;
  let repository: CountryRepositorySqlite;

  beforeEach(async () => {
    const dialect = new SqliteDialect({
      database: new BetterSqlite3(':memory:'),
    });

    db = new Kysely<Database>({ dialect });

    // Create tables
    await db.schema
      .createTable('countries')
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
      .addColumn('created_at', 'text', col => col.defaultTo('now').notNull())
      .addColumn('updated_at', 'text', col => col.defaultTo('now').notNull())
      .execute();

    await db.schema
      .createTable('states')
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('name', 'varchar(128)', col => col.notNull())
      .addColumn('code', 'varchar(10)')
      .addColumn('country_code', 'varchar(5)', col => col.notNull())
      .addColumn('latitude', 'real')
      .addColumn('longitude', 'real')
      .addColumn('created_at', 'text', col => col.defaultTo('now').notNull())
      .addColumn('updated_at', 'text', col => col.defaultTo('now').notNull())
      .execute();

    await db.schema
      .createTable('cities')
      .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
      .addColumn('name', 'varchar(128)', col => col.notNull())
      .addColumn('state_code', 'varchar(10)')
      .addColumn('country_code', 'varchar(5)', col => col.notNull())
      .addColumn('latitude', 'real')
      .addColumn('longitude', 'real')
      .addColumn('created_at', 'text', col => col.defaultTo('now').notNull())
      .addColumn('updated_at', 'text', col => col.defaultTo('now').notNull())
      .execute();

    // Seed data
    await db
      .insertInto('countries')
      .values({
        code: 'CL',
        iso3: 'CHL',
        name: 'Chile',
        capital: 'Santiago',
        latitude: -35.6751,
        longitude: -71.543,
        phone_code: '+56',
        region: 'Americas',
        subregion: 'South America',
        tld: '.cl',
        currency_code: 'CLP',
        currency_symbol: '$',
        currency_name: 'Chilean Peso',
        flag_ico: '🇨🇱',
        flag_alt: 'Chile Flag',
        flag_png: 'png_url',
        flag_svg: 'svg_url',
      })
      .execute();

    await db
      .insertInto('countries')
      .values({
        code: 'AR',
        iso3: 'ARG',
        name: 'Argentina',
        capital: 'Buenos Aires',
        latitude: -38.4161,
        longitude: -63.6167,
        phone_code: '+54',
        region: 'Americas',
        subregion: 'South America',
        tld: '.ar',
        currency_code: 'ARS',
        currency_symbol: '$',
        currency_name: 'Argentine Peso',
        flag_ico: '🇦🇷',
        flag_alt: 'Argentina Flag',
        flag_png: 'ar_png',
        flag_svg: 'ar_svg',
      })
      .execute();

    await db
      .insertInto('states')
      .values({
        name: 'Antofagasta',
        code: 'AN',
        country_code: 'CL',
        latitude: -23.65,
        longitude: -70.4,
      })
      .execute();

    await db
      .insertInto('cities')
      .values({
        name: 'Santiago',
        state_code: 'RM',
        country_code: 'CL',
        latitude: -33.45,
        longitude: -70.67,
      })
      .execute();

    repository = new CountryRepositorySqlite(db);
  });

  afterEach(async () => {
    await db.destroy();
  });

  describe('findAll', () => {
    it('should return all countries', async () => {
      const result = await repository.findAll({
        excludeStates: true,
        excludeCities: true,
      });

      expect(result).toHaveLength(2);
      expect(result.map(r => r.name).sort()).toEqual(['Argentina', 'Chile']);
    });

    it('should include states when not excluded', async () => {
      const result = await repository.findAll({
        excludeStates: false,
        excludeCities: true,
      });

      const chile = result.find(r => r.code === 'CL');
      expect(chile?.states).toHaveLength(1);
      expect(chile?.states?.[0].name).toBe('Antofagasta');
    });

    it('should include cities when not excluded', async () => {
      const result = await repository.findAll({
        excludeStates: true,
        excludeCities: false,
      });

      const chile = result.find(r => r.code === 'CL');
      expect(chile?.cities).toHaveLength(1);
      expect(chile?.cities?.[0].name).toBe('Santiago');
    });
  });

  describe('findOneBy', () => {
    it('should find a country by name', async () => {
      const result = await repository.findOneBy('name', 'Chile', {
        excludeStates: true,
        excludeCities: true,
      });

      expect(result).not.toBeNull();
      expect(result?.code).toBe('CL');
    });

    it('should return null when not found', async () => {
      const result = await repository.findOneBy('name', 'Unknown', {
        excludeStates: true,
        excludeCities: true,
      });

      expect(result).toBeNull();
    });

    it('should find a country by capital', async () => {
      const result = await repository.findOneBy('capital', 'Santiago', {
        excludeStates: false,
        excludeCities: false,
      });

      expect(result).not.toBeNull();
      expect(result?.name).toBe('Chile');
      expect(result?.states).toHaveLength(1);
      expect(result?.cities).toHaveLength(1);
    });
  });

  describe('findAllBy', () => {
    it('should find countries by region', async () => {
      const result = await repository.findAllBy('region', 'Americas', {
        excludeStates: true,
        excludeCities: true,
      });

      expect(result).toHaveLength(2);
    });

    it('should return empty array when region not found', async () => {
      const result = await repository.findAllBy('region', 'Unknown', {
        excludeStates: true,
        excludeCities: true,
      });

      expect(result).toEqual([]);
    });

    it('should find countries by subregion', async () => {
      const result = await repository.findAllBy('subregion', 'South America', {
        excludeStates: true,
        excludeCities: true,
      });

      expect(result).toHaveLength(2);
    });
  });
});
