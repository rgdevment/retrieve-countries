import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryEntity } from '../../../src/modules/countries/entities';
import { CountryRepository } from '../../../src/modules/countries/repositories/country.repository.interface';

describe('CountriesService', () => {
  let service: CountriesService;
  let repository: CountryRepository;

  const mockCountry: CountryEntity = {
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
            findByName: jest.fn(),
            findCountryByStateName: jest.fn(),
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

  describe('getAllCountries', () => {
    it('should return mapped country DTOs with states', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([mockCountry]);

      const result = await service.getAllCountries();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Chile');
      expect(result[0].iso2).toBe('CL');
      expect(result[0].currency.code).toBe('CLP');
      expect(result[0].emoji).toBe('🇨🇱');
      expect(result[0].states).toHaveLength(1);
      expect(result[0].states[0].name).toBe('Antofagasta');
    });

    it('should throw NO_CONTENT when empty', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);
      await expectNoContent(() => service.getAllCountries());
    });
  });

  describe('getCountryByName', () => {
    it('should return a country DTO when found', async () => {
      jest.spyOn(repository, 'findByName').mockResolvedValue(mockCountry);

      const result = await service.getCountryByName('Chile');

      expect(result.name).toBe('Chile');
      expect(result.iso2).toBe('CL');
      expect(result.nationality).toBe('Chilean');
    });

    it('should throw NO_CONTENT when not found', async () => {
      jest.spyOn(repository, 'findByName').mockResolvedValue(null);
      await expectNoContent(() => service.getCountryByName('Unknown'));
    });
  });

  describe('getCountryByStateName', () => {
    it('should return the country containing the state', async () => {
      jest.spyOn(repository, 'findCountryByStateName').mockResolvedValue(mockCountry);

      const result = await service.getCountryByStateName('Antofagasta');

      expect(result.name).toBe('Chile');
      expect(result.iso2).toBe('CL');
      expect(result.states).toHaveLength(1);
      expect(result.states[0].name).toBe('Antofagasta');
    });

    it('should throw NO_CONTENT when not found', async () => {
      jest.spyOn(repository, 'findCountryByStateName').mockResolvedValue(null);
      await expectNoContent(() => service.getCountryByStateName('Unknown'));
    });
  });
});
