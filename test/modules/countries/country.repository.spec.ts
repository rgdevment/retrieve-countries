import BetterSqlite3 from 'better-sqlite3';
import { Kysely, sql, SqliteDialect } from 'kysely';
import { Database } from '../../../src/database/database.types';
import { CountryRepositorySqlite } from '../../../src/modules/countries/repositories/country.repository';
import { HierarchyOptions } from '../../../src/modules/countries/repositories/country.repository.interface';

describe('CountryRepositorySqlite', () => {
  let db: Kysely<Database>;
  let repository: CountryRepositorySqlite;

  const fullOptions: HierarchyOptions = { includeStates: true, includeCities: true };
  const noChildrenOptions: HierarchyOptions = { includeStates: false, includeCities: false };
  const noCitiesOptions: HierarchyOptions = { includeStates: true, includeCities: false };

  beforeEach(async () => {
    const native = new BetterSqlite3(':memory:');
    native.pragma('foreign_keys = ON');

    db = new Kysely<Database>({ dialect: new SqliteDialect({ database: native }) });

    await sql`
      CREATE TABLE regions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        translations TEXT NULL,
        created_at DATETIME NULL,
        updated_at DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        flag TINYINT NOT NULL DEFAULT 1,
        wikiDataId VARCHAR(255) NULL
      )
    `.execute(db);

    await sql`
      CREATE TABLE subregions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        translations TEXT NULL,
        region_id MEDIUMINT NOT NULL,
        created_at DATETIME NULL,
        updated_at DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        flag TINYINT NOT NULL DEFAULT 1,
        wikiDataId VARCHAR(255) NULL,
        FOREIGN KEY(region_id) REFERENCES regions(id)
      )
    `.execute(db);

    await sql`
      CREATE TABLE countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL COLLATE NOCASE,
        iso3 CHARACTER(3) NULL,
        numeric_code CHARACTER(3) NULL,
        iso2 CHARACTER(2) NULL,
        phonecode VARCHAR(255) NULL,
        capital VARCHAR(255) NULL COLLATE NOCASE,
        currency VARCHAR(255) NULL,
        currency_name VARCHAR(255) NULL,
        currency_symbol VARCHAR(255) NULL,
        tld VARCHAR(255) NULL,
        native VARCHAR(255) NULL,
        region VARCHAR(255) NULL,
        region_id MEDIUMINT NULL,
        subregion VARCHAR(255) NULL,
        subregion_id MEDIUMINT NULL,
        nationality VARCHAR(255) NULL,
        timezones TEXT NULL,
        translations TEXT NULL,
        latitude DECIMAL NULL,
        longitude DECIMAL NULL,
        emoji VARCHAR(191) NULL,
        emojiU VARCHAR(191) NULL,
        created_at DATETIME NULL,
        updated_at DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        flag TINYINT NOT NULL DEFAULT 1,
        wikiDataId VARCHAR(255) NULL,
        FOREIGN KEY(region_id) REFERENCES regions(id),
        FOREIGN KEY(subregion_id) REFERENCES subregions(id)
      )
    `.execute(db);

    await sql`
      CREATE TABLE states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL COLLATE NOCASE,
        country_id MEDIUMINT NOT NULL,
        country_code CHARACTER(2) NOT NULL,
        fips_code VARCHAR(255) NULL,
        iso2 VARCHAR(255) NULL,
        type VARCHAR(191) NULL,
        level INTEGER NULL,
        parent_id INTEGER NULL,
        native VARCHAR(255) NULL,
        latitude DECIMAL NULL,
        longitude DECIMAL NULL,
        created_at DATETIME NULL,
        updated_at DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        flag TINYINT NOT NULL DEFAULT 1,
        wikiDataId VARCHAR(255) NULL,
        FOREIGN KEY(country_id) REFERENCES countries(id)
      )
    `.execute(db);

    await sql`
      CREATE TABLE cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL COLLATE NOCASE,
        state_id MEDIUMINT NOT NULL,
        state_code VARCHAR(255) NOT NULL,
        country_id MEDIUMINT NOT NULL,
        country_code CHARACTER(2) NOT NULL,
        latitude DECIMAL NOT NULL,
        longitude DECIMAL NOT NULL,
        created_at DATETIME NOT NULL DEFAULT '2014-01-01 12:01:01',
        updated_at DATETIME NOT NULL DEFAULT 'CURRENT_TIMESTAMP',
        flag TINYINT NOT NULL DEFAULT 1,
        wikiDataId VARCHAR(255) NULL,
        FOREIGN KEY(state_id) REFERENCES states(id),
        FOREIGN KEY(country_id) REFERENCES countries(id)
      )
    `.execute(db);

    await db.insertInto('regions').values({ name: 'Americas', updated_at: '2023-01-01', flag: 1 }).execute();
    await db
      .insertInto('subregions')
      .values({ name: 'South America', region_id: 1, updated_at: '2023-01-01', flag: 1 })
      .execute();

    await db
      .insertInto('countries')
      .values({
        name: 'Chile',
        iso2: 'CL',
        iso3: 'CHL',
        numeric_code: '152',
        phonecode: '+56',
        capital: 'Santiago',
        currency: 'CLP',
        currency_name: 'Chilean Peso',
        currency_symbol: '$',
        tld: '.cl',
        native: 'Chile',
        region: 'Americas',
        region_id: 1,
        subregion: 'South America',
        subregion_id: 1,
        nationality: 'Chilean',
        latitude: -35.6751,
        longitude: -71.543,
        emoji: '🇨🇱',
        emojiU: 'U+1F1E8 U+1F1F1',
        updated_at: '2023-01-01',
        flag: 1,
      })
      .execute();

    await db
      .insertInto('countries')
      .values({
        name: 'Argentina',
        iso2: 'AR',
        iso3: 'ARG',
        numeric_code: '032',
        phonecode: '+54',
        capital: 'Buenos Aires',
        currency: 'ARS',
        currency_name: 'Argentine Peso',
        currency_symbol: '$',
        tld: '.ar',
        native: 'Argentina',
        region: 'Americas',
        region_id: 1,
        subregion: 'South America',
        subregion_id: 1,
        nationality: 'Argentinean',
        latitude: -38.4161,
        longitude: -63.6167,
        emoji: '🇦🇷',
        emojiU: 'U+1F1E6 U+1F1F7',
        updated_at: '2023-01-01',
        flag: 1,
      })
      .execute();

    await db
      .insertInto('states')
      .values({
        name: 'Antofagasta',
        country_id: 1,
        country_code: 'CL',
        iso2: 'AN',
        type: 'region',
        latitude: -23.65,
        longitude: -70.4,
        updated_at: '2023-01-01',
        flag: 1,
      })
      .execute();

    await db
      .insertInto('states')
      .values({
        name: 'Buenos Aires',
        country_id: 2,
        country_code: 'AR',
        iso2: 'BA',
        type: 'province',
        latitude: -34.6,
        longitude: -58.38,
        updated_at: '2023-01-01',
        flag: 1,
      })
      .execute();

    await db
      .insertInto('cities')
      .values({
        name: 'Calama',
        state_id: 1,
        state_code: 'AN',
        country_id: 1,
        country_code: 'CL',
        latitude: -22.46,
        longitude: -68.93,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        flag: 1,
      })
      .execute();

    await db
      .insertInto('cities')
      .values({
        name: 'La Plata',
        state_id: 2,
        state_code: 'BA',
        country_id: 2,
        country_code: 'AR',
        latitude: -34.92,
        longitude: -57.95,
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        flag: 1,
      })
      .execute();

    repository = new CountryRepositorySqlite(db);
  });

  afterEach(async () => {
    await db.destroy();
  });

  describe('findAll', () => {
    it('should return all countries with states and cities', async () => {
      const result = await repository.findAll(fullOptions);

      expect(result).toHaveLength(2);
      expect(result.map(r => r.name).sort()).toEqual(['Argentina', 'Chile']);

      const chile = result.find(r => r.name === 'Chile')!;
      expect(chile.id).toBe(1);
      expect(chile.states).toHaveLength(1);
      expect(chile.states[0].name).toBe('Antofagasta');
      expect(chile.states[0].id).toBe(1);
      expect(chile.states[0].cities).toHaveLength(1);
      expect(chile.states[0].cities[0].name).toBe('Calama');
      expect(chile.states[0].cities[0].id).toBe(1);

      const argentina = result.find(r => r.name === 'Argentina')!;
      expect(argentina.states).toHaveLength(1);
      expect(argentina.states[0].name).toBe('Buenos Aires');
      expect(argentina.states[0].cities).toHaveLength(1);
    });

    it('should exclude states when option is set', async () => {
      const result = await repository.findAll(noChildrenOptions);

      expect(result).toHaveLength(2);
      expect(result.every(r => r.states.length === 0)).toBe(true);
    });

    it('should exclude cities when option is set', async () => {
      const result = await repository.findAll(noCitiesOptions);

      expect(result).toHaveLength(2);
      const chile = result.find(r => r.name === 'Chile')!;
      expect(chile.states).toHaveLength(1);
      expect(chile.states[0].cities).toHaveLength(0);
    });

    it('should map currency from separate columns', async () => {
      const result = await repository.findAll(fullOptions);
      const chile = result.find(r => r.iso2 === 'CL')!;

      expect(chile.currency).toEqual({ code: 'CLP', name: 'Chilean Peso', symbol: '$' });
    });

    it('should return empty array when no countries', async () => {
      await sql`DELETE FROM cities`.execute(db);
      await sql`DELETE FROM states`.execute(db);
      await sql`DELETE FROM countries`.execute(db);

      const result = await repository.findAll(fullOptions);
      expect(result).toEqual([]);
    });
  });

  describe('findByTerm', () => {
    it('should find a country by name', async () => {
      const result = await repository.findByTerm('Chile', fullOptions);

      expect(result).not.toBeNull();
      expect(result!.iso2).toBe('CL');
      expect(result!.id).toBe(1);
      expect(result!.states).toHaveLength(1);
      expect(result!.states[0].cities).toHaveLength(1);
    });

    it('should find a country by ISO2 code', async () => {
      const result = await repository.findByTerm('CL', fullOptions);
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Chile');
    });

    it('should find a country by ISO2 code (lowercase)', async () => {
      const result = await repository.findByTerm('cl', fullOptions);
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Chile');
    });

    it('should find a country by ISO3 code', async () => {
      const result = await repository.findByTerm('CHL', fullOptions);
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Chile');
    });

    it('should find a country by numeric ID', async () => {
      const result = await repository.findByTerm('1', fullOptions);
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Chile');
    });

    it('should be case-insensitive for names', async () => {
      const lower = await repository.findByTerm('chile', fullOptions);
      const upper = await repository.findByTerm('CHILE', fullOptions);
      const mixed = await repository.findByTerm('cHiLe', fullOptions);

      expect(lower).not.toBeNull();
      expect(lower!.name).toBe('Chile');
      expect(upper).not.toBeNull();
      expect(mixed).not.toBeNull();
    });

    it('should be accent-insensitive', async () => {
      await db
        .insertInto('countries')
        .values({
          name: 'México',
          iso2: 'MX',
          iso3: 'MEX',
          numeric_code: '484',
          phonecode: '+52',
          capital: 'Ciudad de México',
          currency: 'MXN',
          currency_name: 'Mexican Peso',
          currency_symbol: '$',
          tld: '.mx',
          native: 'México',
          region: 'Americas',
          region_id: 1,
          subregion: 'South America',
          subregion_id: 1,
          nationality: 'Mexican',
          latitude: 23.6345,
          longitude: -102.5528,
          emoji: '🇲🇽',
          emojiU: 'U+1F1F2 U+1F1FD',
          updated_at: '2023-01-01',
          flag: 1,
        })
        .execute();

      const result = await repository.findByTerm('Mexico', fullOptions);
      expect(result).not.toBeNull();
      expect(result!.name).toBe('México');
    });

    it('should return null when not found', async () => {
      const result = await repository.findByTerm('Narnia', fullOptions);
      expect(result).toBeNull();
    });

    it('should find by partial name (starts-with)', async () => {
      const result = await repository.findByTerm('Chi', fullOptions);
      expect(result).not.toBeNull();
      expect(result!.name).toBe('Chile');
    });
  });

  describe('findByRegion', () => {
    it('should return countries in the specified region', async () => {
      const result = await repository.findByRegion('Americas', fullOptions);

      expect(result).toHaveLength(2);
      expect(result.map(r => r.name).sort()).toEqual(['Argentina', 'Chile']);
    });

    it('should return empty array when region not found', async () => {
      const result = await repository.findByRegion('Atlantis', fullOptions);
      expect(result).toEqual([]);
    });
  });

  describe('findBySubregion', () => {
    it('should return countries in the specified subregion', async () => {
      const result = await repository.findBySubregion('South America', fullOptions);

      expect(result).toHaveLength(2);
      expect(result.map(r => r.name).sort()).toEqual(['Argentina', 'Chile']);
    });

    it('should return empty array when subregion not found', async () => {
      const result = await repository.findBySubregion('Atlantis', fullOptions);
      expect(result).toEqual([]);
    });
  });

  describe('findStateById', () => {
    it('should return a state with its cities', async () => {
      const result = await repository.findStateById(1, true);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Antofagasta');
      expect(result!.id).toBe(1);
      expect(result!.cities).toHaveLength(1);
      expect(result!.cities[0].name).toBe('Calama');
    });

    it('should return a state without cities when excluded', async () => {
      const result = await repository.findStateById(1, false);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Antofagasta');
      expect(result!.cities).toHaveLength(0);
    });

    it('should return null when state not found', async () => {
      const result = await repository.findStateById(9999, true);
      expect(result).toBeNull();
    });
  });

  describe('findCityById', () => {
    it('should return a city by ID', async () => {
      const result = await repository.findCityById(1);

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Calama');
      expect(result!.id).toBe(1);
      expect(result!.country_code).toBe('CL');
    });

    it('should return null when city not found', async () => {
      const result = await repository.findCityById(9999);
      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('should find countries by name', async () => {
      const result = await repository.search('Chile', 10);

      expect(result.countries).toHaveLength(1);
      expect(result.countries[0].name).toBe('Chile');
      expect(result.countries[0].iso2).toBe('CL');
    });

    it('should find states by name', async () => {
      const result = await repository.search('Antofagasta', 10);

      expect(result.states).toHaveLength(1);
      expect(result.states[0].name).toBe('Antofagasta');
      expect(result.states[0].country_name).toBe('Chile');
    });

    it('should find cities by name', async () => {
      const result = await repository.search('Calama', 10);

      expect(result.cities).toHaveLength(1);
      expect(result.cities[0].name).toBe('Calama');
      expect(result.cities[0].country_name).toBe('Chile');
      expect(result.cities[0].state_name).toBe('Antofagasta');
    });

    it('should return empty results for no matches', async () => {
      const result = await repository.search('zzzzz', 10);

      expect(result.countries).toHaveLength(0);
      expect(result.states).toHaveLength(0);
      expect(result.cities).toHaveLength(0);
    });
  });
});
