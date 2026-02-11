import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ExcludeOptions } from '../../../src/common/interfaces/exclude-options.interface';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryRepository } from '../../../src/modules/countries/repositories/country.repository.interface';

describe('CountriesService', () => {
  let service: CountriesService;
  let repository: CountryRepository;

  const mockCountryRow = {
    name: 'Chile',
    capital: 'Santiago',
    code: 'CL',
    iso3: 'CHL',
    phone_code: '+56',
    region: 'Americas',
    subregion: 'South America',
    latitude: -35.6751,
    longitude: -71.543,
    tld: '.cl',
    currency_code: 'CLP',
    currency_symbol: 'C$',
    currency_name: 'Chilean Peso',
    flag_ico: '🇨🇱',
    flag_alt: 'Chile Flag',
    flag_png: 'png_url',
    flag_svg: 'svg_url',
    states: [
      {
        name: 'Antofagasta',
        code: 'AN',
        country_code: 'CL',
        latitude: -23.65,
        longitude: -70.4,
      },
    ],
    cities: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: 'CountryRepository',
          useValue: {
            findAll: jest.fn(),
            findOneBy: jest.fn(),
            findAllBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
    repository = module.get<CountryRepository>('CountryRepository');
  });

  const expectNoContent = async (fn: () => Promise<unknown>) => {
    await expect(fn()).rejects.toThrow(HttpException);
    await expect(fn()).rejects.toMatchObject({
      status: HttpStatus.NO_CONTENT,
    });
  };

  describe('getAllCountries', () => {
    it('should return mapped country DTOs', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([mockCountryRow]);
      const options: ExcludeOptions = {
        excludeStates: false,
        excludeCities: true,
      };

      const result = await service.getAllCountries(options);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Chile');
      expect(result[0].currency.code).toBe('CLP');
      expect(result[0].flags.ico).toBe('🇨🇱');
      expect(repository.findAll).toHaveBeenCalledWith(options);
    });

    it('should throw NO_CONTENT when no countries found', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);
      await expectNoContent(() => service.getAllCountries({ excludeStates: false }));
    });
  });

  describe('getCountryByName', () => {
    it('should return a country DTO when found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCountryRow);
      const options: ExcludeOptions = { excludeStates: true };

      const result = await service.getCountryByName('Chile', options);

      expect(result.name).toBe('Chile');
      expect(result.code).toBe('CL');
      expect(repository.findOneBy).toHaveBeenCalledWith('name', 'Chile', options);
    });

    it('should throw NO_CONTENT when not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expectNoContent(() => service.getCountryByName('Unknown', { excludeStates: false }));
    });
  });

  describe('getCountryByCapital', () => {
    it('should return a country DTO when found by capital', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCountryRow);

      const result = await service.getCountryByCapital('Santiago', {
        excludeStates: false,
      });

      expect(result.capital).toBe('Santiago');
      expect(repository.findOneBy).toHaveBeenCalledWith('capital', 'Santiago', expect.any(Object));
    });

    it('should throw NO_CONTENT when capital not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      await expectNoContent(() => service.getCountryByCapital('Unknown', { excludeStates: false }));
    });
  });

  describe('getCountryByRegion', () => {
    it('should return countries by region', async () => {
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([mockCountryRow]);

      const result = await service.getCountryByRegion('Americas', {
        excludeStates: false,
      });

      expect(result).toHaveLength(1);
      expect(result[0].region).toBe('Americas');
    });

    it('should throw NO_CONTENT when region not found', async () => {
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([]);
      await expectNoContent(() => service.getCountryByRegion('Unknown', { excludeStates: false }));
    });
  });

  describe('getCountryBySubregion', () => {
    it('should return countries by subregion', async () => {
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([mockCountryRow]);

      const result = await service.getCountryBySubregion('South America', {
        excludeStates: false,
      });

      expect(result).toHaveLength(1);
      expect(result[0].subregion).toBe('South America');
    });

    it('should throw NO_CONTENT when subregion not found', async () => {
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([]);
      await expectNoContent(() => service.getCountryBySubregion('Unknown', { excludeStates: false }));
    });
  });
});
