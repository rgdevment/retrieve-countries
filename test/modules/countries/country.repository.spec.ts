import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CountryRepositoryMongo } from '../../../src/modules/countries/repositories/country.repository';
import { Country } from '../../../src/common/schemas/country.schema';
import { ExcludeOptions } from '../../../src/common/interfaces/exclude-options.interface';

describe('CountryRepositoryMongo', () => {
  let repository: CountryRepositoryMongo;

  const mockCountry = {
    name: 'Chile',
    capital: 'Santiago',
    code: 'CL',
    currency: { symbol: 'C$', code: 'CLP', name: 'Chilean Peso' },
    flags: { ico: 'icon', alt: 'Chile Flag', png: 'png_url', svg: 'svg_url' },
    iso3: 'CHL',
    latitude: -35.6751,
    longitude: -71.543,
    phone_code: '+56',
    region: 'Americas',
    subregion: 'South America',
    tld: '.cl',
    cities: [],
    states: [{ name: 'Antofagasta', code: 'AN', country_code: 'CL', latitude: -23.65, longitude: -70.4 }],
  };

  const mockCountryModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    collection: {
      createIndex: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryRepositoryMongo,
        {
          provide: getModelToken(Country.name),
          useValue: mockCountryModel,
        },
      ],
    }).compile();

    repository = module.get<CountryRepositoryMongo>(CountryRepositoryMongo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should find all countries excluding cities', async () => {
      mockCountryModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCountry]),
      });

      const options: ExcludeOptions = { excludeStates: false, excludeCities: true };
      const result = await repository.findAll(options);

      expect(mockCountryModel.find).toHaveBeenCalledWith({}, { cities: 0 });
      expect(result).toEqual([mockCountry]);
    });

    it('should exclude states when excludeStates is true', async () => {
      mockCountryModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCountry]),
      });

      const options: ExcludeOptions = { excludeStates: true, excludeCities: false };
      const result = await repository.findAll(options);

      expect(mockCountryModel.find).toHaveBeenCalledWith({}, { states: 0 });
      expect(result).toEqual([mockCountry]);
    });

    it('should include all fields when no options are set', async () => {
      mockCountryModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCountry]),
      });

      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      const result = await repository.findAll(options);

      expect(mockCountryModel.find).toHaveBeenCalledWith({}, {});
      expect(result).toEqual([mockCountry]);
    });
  });

  describe('findOneBy', () => {
    it('should find a country by exact name', async () => {
      mockCountryModel.findOne.mockReturnValue({
        collation: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCountry),
      });

      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const result = await repository.findOneBy('name', mockCountry.name, options);

      expect(mockCountryModel.findOne).toHaveBeenCalledWith({ name: mockCountry.name }, { states: 0, cities: 0 });
      expect(result).toEqual(mockCountry);
    });

    it('should return null if country is not found', async () => {
      mockCountryModel.findOne.mockReturnValue({
        collation: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      const result = await repository.findOneBy('name', 'Nonexistent Country', options);

      expect(mockCountryModel.findOne).toHaveBeenCalledWith({ name: 'Nonexistent Country' }, {});
      expect(result).toBeNull();
    });
  });

  describe('findAllBy', () => {
    it('should find countries by field and exclude options', async () => {
      mockCountryModel.find.mockReturnValue({
        collation: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockCountry]),
      });

      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const result = await repository.findAllBy('region', 'Americas', options);

      expect(mockCountryModel.find).toHaveBeenCalledWith({ region: 'Americas' }, { states: 0, cities: 0 });
      expect(result).toEqual([mockCountry]);
    });

    it('should return empty array if no countries are found', async () => {
      mockCountryModel.find.mockReturnValue({
        collation: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      const result = await repository.findAllBy('region', 'Nonexistent Region', options);

      expect(mockCountryModel.find).toHaveBeenCalledWith({ region: 'Nonexistent Region' }, {});
      expect(result).toEqual([]);
    });
  });
});
