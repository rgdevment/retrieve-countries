import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { CountryRepositoryMongo } from '../../../src/modules/countries/repositories/country.repository';
import { Country, CountrySchema } from '../../../src/common/schemas/country.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('CountryRepositoryMongo', () => {
  let repository: CountryRepositoryMongo;
  let mongoServer: MongoMemoryServer;
  let connection: mongoose.Connection;
  let countryModel: Model<Country>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
      ],
      providers: [
        CountryRepositoryMongo,
        {
          provide: 'CountryRepository',
          useClass: CountryRepositoryMongo,
        },
      ],
    }).compile();

    repository = module.get<CountryRepositoryMongo>(CountryRepositoryMongo);
    countryModel = module.get<Model<Country>>('CountryModel');
    connection = mongoose.connection;

    await countryModel.createCollection();
    await countryModel.collection.createIndex({ name: 'text' });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await countryModel.createCollection();
    await countryModel.collection.createIndex({ name: 'text' });
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should find all countries excluding cities', async () => {
    const mockCountry = {
      name: 'Country 1',
      capital: 'Capital 1',
      code: 'C1',
      currency: { symbol: 'C$', code: 'C1', name: 'Currency 1' },
      flags: { ico: 'icon', alt: 'flag', png: 'png', svg: 'svg' },
      iso3: 'C1C',
      latitude: 10,
      longitude: 20,
      phone_code: '+1',
      region: 'Region 1',
      subregion: 'Subregion 1',
      cities: [],
      states: [{ name: 'State 1', code: 'S1', country_code: 'C1', latitude: 10, longitude: 20 }],
      tld: '.c1',
    };

    await countryModel.create(mockCountry);

    const result = await repository.findAll({ excludeStates: false });
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Country 1');
    expect(result[0].cities).toBeUndefined();
    expect(result[0].states).toBeDefined();
  });

  it('should exclude states when includeStates is true', async () => {
    const mockCountry = {
      name: 'Chile',
      capital: 'Capital 2',
      code: 'C2',
      currency: { symbol: 'C$', code: 'C2', name: 'Currency 2' },
      flags: { ico: 'icon', alt: 'flag', png: 'png', svg: 'svg' },
      iso3: 'C2C',
      latitude: 20,
      longitude: 30,
      phone_code: '+2',
      region: 'Region 2',
      subregion: 'Subregion 2',
      states: [{ name: 'Antofagasta', code: 'S2', country_code: 'C2', latitude: 20, longitude: 30 }],
      tld: '.c2',
    };

    await countryModel.create(mockCountry);

    const result = await repository.findAll({ excludeStates: false });
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Chile');
    expect(result[0].states[0].name).toEqual('Antofagasta');
  });

  it('should exclude states when includeStates is false', async () => {
    const mockCountry = {
      name: 'Chile',
      capital: 'Capital 2',
      code: 'C2',
      currency: { symbol: 'C$', code: 'C2', name: 'Currency 2' },
      flags: { ico: 'icon', alt: 'flag', png: 'png', svg: 'svg' },
      iso3: 'C2C',
      latitude: 20,
      longitude: 30,
      phone_code: '+2',
      region: 'Region 2',
      subregion: 'Subregion 2',
      tld: '.c2',
    };

    await countryModel.create(mockCountry);

    const result = await repository.findAll({ excludeStates: true });
    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Chile');
    expect(result[0].states).toBeUndefined();
  });

  it('should find a country by exact name', async () => {
    const mockCountry = {
      name: "Cote D'Ivoire (Ivory Coast)",
      capital: 'Yamoussoukro',
      code: 'CI',
      currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA franc' },
      flags: { ico: 'ico', alt: 'flag', png: 'png', svg: 'svg' },
      iso3: 'CIV',
      latitude: 7.539989,
      longitude: -5.54708,
      phone_code: '+225',
      region: 'Africa',
      subregion: 'Western Africa',
      tld: '.ci',
      cities: [],
      states: [],
    };

    await countryModel.createCollection();
    await countryModel.collection.createIndex({ name: 'text' });

    await countryModel.create(mockCountry);

    const result = await repository.findByField('name', "Cote D'Ivoire (Ivory Coast)", {
      excludeCities: true,
      excludeStates: true,
    });

    expect(result).not.toBeNull();
    expect(result?.name).toEqual(mockCountry.name);
  });

  it('should return null if country is not found', async () => {
    const result = await repository.findByField('name', 'Nonexistent Country', {
      excludeCities: false,
      excludeStates: false,
    });
    expect(result).toBeNull();
  });
});
