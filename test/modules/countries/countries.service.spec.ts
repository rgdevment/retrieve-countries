import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CountryCacheService } from '../../../src/modules/countries/cache';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { ExcludeOption, ResponseType } from '../../../src/modules/countries/dto/country-query.dto';
import { CountryEntity } from '../../../src/modules/countries/entities';
import { CountryRepository } from '../../../src/modules/countries/repositories/country.repository.interface';
import { MOCK_STATE_NO_CITIES, mockCountryEntity } from '../../fixtures/country.fixtures';

describe('CountriesService', () => {
  let service: CountriesService;
  let repository: CountryRepository;
  let cache: CountryCacheService;

  const mockCountry = mockCountryEntity({
    phonecode: '+56',
    states: [MOCK_STATE_NO_CITIES],
  });

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
        {
          provide: CountryCacheService,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    repository = module.get<CountryRepository>('CountryRepository');
    cache = module.get<CountryCacheService>(CountryCacheService);
  });

  const expectNoContent = async (fn: () => Promise<unknown>) => {
    await expect(fn()).rejects.toThrow(HttpException);
    await expect(fn()).rejects.toMatchObject({ status: HttpStatus.NO_CONTENT });
  };

  describe('findAllCountriesGzip', () => {
    it('should return gzip buffer with count', () => {
      const mockEntry = { gzip: Buffer.from('test'), count: 1 };
      jest.spyOn(cache, 'getAll').mockReturnValue(mockEntry);

      const result = service.findAllCountriesGzip();

      expect(result).toBe(mockEntry);
      expect(result.count).toBe(1);
    });

    it('should throw NO_CONTENT when cache is null', () => {
      jest.spyOn(cache, 'getAll').mockReturnValue(null);
      expect(() => service.findAllCountriesGzip()).toThrow(HttpException);
    });

    it('should throw NO_CONTENT when cache count is 0', () => {
      jest.spyOn(cache, 'getAll').mockReturnValue({ gzip: Buffer.alloc(0), count: 0 });
      expect(() => service.findAllCountriesGzip()).toThrow(HttpException);
    });

    it('should pass type and exclude to cache', () => {
      const mockEntry = { gzip: Buffer.from('test'), count: 1 };
      jest.spyOn(cache, 'getAll').mockReturnValue(mockEntry);

      service.findAllCountriesGzip(ExcludeOption.CITIES, ResponseType.SIMPLE);

      expect(cache.getAll).toHaveBeenCalledWith(ResponseType.SIMPLE, ExcludeOption.CITIES);
    });

    it('should pass exclude=states to cache', () => {
      const mockEntry = { gzip: Buffer.from('test'), count: 1 };
      jest.spyOn(cache, 'getAll').mockReturnValue(mockEntry);

      service.findAllCountriesGzip(ExcludeOption.STATES);

      expect(cache.getAll).toHaveBeenCalledWith(undefined, ExcludeOption.STATES);
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
