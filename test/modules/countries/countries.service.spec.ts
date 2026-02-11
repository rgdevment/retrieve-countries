import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryEntity } from '../../../src/modules/countries/entities';
import { CountryRepository } from '../../../src/modules/countries/repositories/country.repository.interface';

describe('CountriesService', () => {
  let service: CountriesService;
  let repository: CountryRepository;

  const mockCountry: CountryEntity = {
    id: 44,
    name: 'Chile',
    iso2: 'CL',
    iso3: 'CHL',
    numeric_code: '152',
    capital: 'Santiago',
    phonecode: '+56',
    tld: '.cl',
    native: 'Chile',
    nationality: 'Chilean',
    region: { name: 'Americas', translations: null, wikiDataId: '' },
    subregion: { name: 'South America', translations: null, wikiDataId: '' },
    latitude: -35.6751,
    longitude: -71.543,
    emoji: '🇨🇱',
    emojiU: 'U+1F1E8 U+1F1F1',
    timezones: [],
    translations: null,
    wikiDataId: '',
    currency: { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    states: [
      {
        id: 2113,
        name: 'Antofagasta',
        iso2: 'AN',
        type: 'region',
        country_code: 'CL',
        fips_code: '',
        level: null,
        parent_id: null,
        native: '',
        latitude: -23.65,
        longitude: -70.4,
        wikiDataId: '',
        cities: [],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: 'CountryRepository',
          useValue: {
            findAll: jest.fn(),
            findByTerm: jest.fn(),
            findByRegion: jest.fn(),
            findBySubregion: jest.fn(),
            findStateById: jest.fn(),
            findCityById: jest.fn(),
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    repository = module.get<CountryRepository>('CountryRepository');
  });

  const expectNoContent = async (fn: () => Promise<unknown>) => {
    await expect(fn()).rejects.toThrow(HttpException);
    await expect(fn()).rejects.toMatchObject({ status: HttpStatus.NO_CONTENT });
  };

  describe('findAllCountries', () => {
    it('should return mapped country DTOs with states', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([mockCountry]);

      const result = await service.findAllCountries();

      expect(result).toHaveLength(1);
      const country = (result as CountryEntity[])[0];
      expect(country.name).toBe('Chile');
      expect(country.iso2).toBe('CL');
      expect(country.currency.code).toBe('CLP');
      expect(country.emoji).toBe('🇨🇱');
      expect(country.states).toHaveLength(1);
      expect(country.states[0].name).toBe('Antofagasta');
    });

    it('should throw NO_CONTENT when empty', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);
      await expectNoContent(() => service.findAllCountries());
    });
  });

  describe('findCountryByTerm', () => {
    it('should return a country DTO when found', async () => {
      jest.spyOn(repository, 'findByTerm').mockResolvedValue(mockCountry);

      const result = await service.findCountryByTerm('Chile');

      expect((result as CountryEntity).name).toBe('Chile');
      expect((result as CountryEntity).iso2).toBe('CL');
      expect((result as CountryEntity).nationality).toBe('Chilean');
    });

    it('should throw NO_CONTENT when not found', async () => {
      jest.spyOn(repository, 'findByTerm').mockResolvedValue(null);
      await expectNoContent(() => service.findCountryByTerm('Unknown'));
    });
  });

  describe('findCountriesByRegion', () => {
    it('should return countries in the specified region', async () => {
      jest.spyOn(repository, 'findByRegion').mockResolvedValue([mockCountry]);

      const result = await service.findCountriesByRegion('Americas');

      expect(result).toHaveLength(1);
      expect((result as CountryEntity[])[0].name).toBe('Chile');
    });

    it('should throw NO_CONTENT when not found', async () => {
      jest.spyOn(repository, 'findByRegion').mockResolvedValue([]);
      await expectNoContent(() => service.findCountriesByRegion('Unknown'));
    });
  });

  describe('findStateById', () => {
    it('should return a state when found', async () => {
      const mockState = mockCountry.states[0];
      jest.spyOn(repository, 'findStateById').mockResolvedValue(mockState);

      const result = await service.findStateById(2113, false);
      expect(result.name).toBe('Antofagasta');
    });

    it('should throw NO_CONTENT when not found', async () => {
      jest.spyOn(repository, 'findStateById').mockResolvedValue(null);
      await expectNoContent(() => service.findStateById(9999, false));
    });
  });

  describe('search', () => {
    it('should throw BAD_REQUEST for short query', async () => {
      await expect(service.search('A')).rejects.toThrow(HttpException);
    });

    it('should delegate to repository', async () => {
      const mockResult = { countries: [], states: [], cities: [] };
      jest.spyOn(repository, 'search').mockResolvedValue(mockResult);

      const result = await service.search('Santiago');
      expect(result).toEqual(mockResult);
    });
  });
});
