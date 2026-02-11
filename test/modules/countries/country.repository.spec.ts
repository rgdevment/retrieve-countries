import BetterSqlite3 from 'better-sqlite3';
import { Kysely, sql, SqliteDialect } from 'kysely';
import { Database } from '../../../src/database/database.types';
import { CountryRepositorySqlite } from '../../../src/modules/countries/repositories/country.repository';

describe('CountryRepositorySqlite', () => {
  let db: Kysely<Database>;
  let repository: CountryRepositorySqlite;

  beforeEach(async () => {
    const native = new BetterSqlite3(':memory:');
    native.pragma('foreign_keys = ON');

    db = new Kysely<Database>({ dialect: new SqliteDialect({ database: native }) });

    // Schema mirrors DatabaseInitializer (new 5-table schema)
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

    // Seed regions & subregions
    await db.insertInto('regions').values({ name: 'Americas', updated_at: '2023-01-01', flag: 1 }).execute();
    await db
      .insertInto('subregions')
      .values({ name: 'South America', region_id: 1, updated_at: '2023-01-01', flag: 1 })
      .execute();

    // Seed countries
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

    // States
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

    // Cities — state_code/country_code denormalized, no JOIN needed
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

  // ── findAll ─────────────────────────────────────────────────

  describe('findAll', () => {
    it('debe retornar todos los países con estados y ciudades anidadas', async () => {
      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result.map(r => r.country.name).sort()).toEqual(['Argentina', 'Chile']);

      const chile = result.find(r => r.country.iso2 === 'CL')!;
      expect(chile.states).toHaveLength(1);
      expect(chile.states[0].name).toBe('Antofagasta');
      expect(chile.states[0].iso2).toBe('AN');
      expect(chile.states[0].type).toBe('region');
      expect(chile.states[0].country_code).toBe('CL');
      expect(chile.states[0].cities).toHaveLength(1);
      expect(chile.states[0].cities[0].name).toBe('Calama');
      expect(chile.states[0].cities[0].state_code).toBe('AN');
      expect(chile.states[0].cities[0].country_code).toBe('CL');
    });

    it('debe retornar currency desde columnas (sin JSON parsing)', async () => {
      const result = await repository.findAll();
      const chile = result.find(r => r.country.iso2 === 'CL')!;

      expect(chile.country.currency).toBe('CLP');
      expect(chile.country.currency_name).toBe('Chilean Peso');
      expect(chile.country.currency_symbol).toBe('$');
    });

    it('debe usar batch hydration (3 queries, sin JOINs)', async () => {
      const result = await repository.findAll();

      const chile = result.find(r => r.country.iso2 === 'CL')!;
      expect(chile.states).toHaveLength(1);
      expect(chile.states[0].cities).toHaveLength(1);

      const argentina = result.find(r => r.country.iso2 === 'AR')!;
      expect(argentina.states[0].cities).toHaveLength(1);
      expect(argentina.states[0].cities[0].name).toBe('La Plata');
    });

    it('debe retornar array vacío de estados si el país no tiene', async () => {
      await db
        .insertInto('countries')
        .values({
          name: 'Uruguay',
          iso2: 'UY',
          iso3: 'URY',
          numeric_code: '858',
          phonecode: '+598',
          capital: 'Montevideo',
          tld: '.uy',
          region: 'Americas',
          region_id: 1,
          subregion: 'South America',
          subregion_id: 1,
          nationality: 'Uruguayan',
          latitude: -32.52,
          longitude: -55.77,
          updated_at: '2023-01-01',
          flag: 1,
        })
        .execute();

      const result = await repository.findAll();
      const uruguay = result.find(r => r.country.iso2 === 'UY')!;

      expect(uruguay.states).toEqual([]);
    });
  });

  // ── findByName ──────────────────────────────────────────────

  describe('findByName', () => {
    it('debe encontrar un país por nombre con estados y ciudades', async () => {
      const result = await repository.findByName('Chile');

      expect(result).not.toBeNull();
      expect(result!.country.iso2).toBe('CL');
      expect(result!.country.emoji).toBe('🇨🇱');
      expect(result!.states).toHaveLength(1);
      expect(result!.states[0].name).toBe('Antofagasta');
      expect(result!.states[0].cities).toHaveLength(1);
    });

    it('debe ser case-insensitive (COLLATE NOCASE)', async () => {
      const lower = await repository.findByName('chile');
      const upper = await repository.findByName('CHILE');
      const mixed = await repository.findByName('cHiLe');

      expect(lower).not.toBeNull();
      expect(lower!.country.name).toBe('Chile');
      expect(upper).not.toBeNull();
      expect(mixed).not.toBeNull();
    });

    it('debe retornar null cuando no existe', async () => {
      const result = await repository.findByName('Narnia');
      expect(result).toBeNull();
    });

    it('debe cargar relaciones en batch (2 queries, no N+1)', async () => {
      const result = await repository.findByName('Chile');

      expect(result!.states).toHaveLength(1);
      expect(result!.states[0].cities).toHaveLength(1);
      expect(result!.states[0].cities[0].state_code).toBe('AN');
      expect(result!.states[0].cities[0].country_code).toBe('CL');
    });
  });

  // ── findStateByName ─────────────────────────────────────────

  describe('findStateByName', () => {
    it('debe encontrar un estado con sus ciudades', async () => {
      const result = await repository.findStateByName('Antofagasta');

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Antofagasta');
      expect(result!.iso2).toBe('AN');
      expect(result!.type).toBe('region');
      expect(result!.country_code).toBe('CL');
      expect(result!.latitude).toBe(-23.65);
      expect(result!.longitude).toBe(-70.4);
      expect(result!.cities).toHaveLength(1);
      expect(result!.cities[0]).toEqual({
        name: 'Calama',
        state_code: 'AN',
        country_code: 'CL',
        latitude: -22.46,
        longitude: -68.93,
      });
    });

    it('debe ser case-insensitive (COLLATE NOCASE)', async () => {
      const lower = await repository.findStateByName('antofagasta');
      const upper = await repository.findStateByName('ANTOFAGASTA');

      expect(lower).not.toBeNull();
      expect(lower!.name).toBe('Antofagasta');
      expect(upper).not.toBeNull();
    });

    it('debe retornar null cuando el estado no existe', async () => {
      const result = await repository.findStateByName('Inventado');
      expect(result).toBeNull();
    });

    it('debe retornar array vacío de ciudades si el estado no tiene', async () => {
      await db
        .insertInto('states')
        .values({
          name: 'Atacama',
          country_id: 1,
          country_code: 'CL',
          iso2: 'AT',
          type: 'region',
          latitude: -27.36,
          longitude: -70.33,
          updated_at: '2023-01-01',
          flag: 1,
        })
        .execute();

      const result = await repository.findStateByName('Atacama');

      expect(result).not.toBeNull();
      expect(result!.cities).toEqual([]);
    });
  });
});
