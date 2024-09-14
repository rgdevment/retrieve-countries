import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryRepository } from '../../../src/modules/countries/repositories/country.repository.interface';
import { CountryDto } from '../../../src/common/dto/country.dto';
import { ExcludeOptions } from '../../../src/common/interfaces/exclude-options.interface';

describe('CountriesService', () => {
  let service: CountriesService;
  let repository: CountryRepository;

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

  describe('getAllCountries', () => {
    it('should return a list of countries with states', async () => {
      const mockCountries = [
        {
          name: 'Chile',
          capital: 'Capital 1',
          code: 'C1',
          currency: { symbol: 'C$', code: 'C1', name: 'Currency 1' },
          flags: { ico: 'icon', alt: 'flag', png: 'png', svg: 'svg' },
          iso3: 'C1C',
          latitude: 10,
          longitude: 20,
          phone_code: '+1',
          region: 'Region 1',
          states: [{ name: 'Antofagasta', code: 'S1', country_code: 'C1', latitude: 10, longitude: 20 }],
          subregion: 'Subregion 1',
          tld: '.c1',
        },
      ];

      jest.spyOn(repository, 'findAll').mockResolvedValue(mockCountries as any);
      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const countries = await service.getAllCountries(options);
      expect(countries).toEqual(plainToInstance(CountryDto, countries, { excludeExtraneousValues: true }));
    });

    it('should return a list of countries without states', async () => {
      const mockCountries = [
        {
          name: 'Chile',
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
          tld: '.c1',
        },
      ];

      jest.spyOn(repository, 'findAll').mockResolvedValue(mockCountries as any);
      const options: ExcludeOptions = { excludeStates: false, excludeCities: true };
      const countries = await service.getAllCountries(options);
      expect(countries).toEqual(plainToInstance(CountryDto, countries, { excludeExtraneousValues: true }));
    });

    it('should throw no content exception if no countries are found', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);

      try {
        const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
        await service.getAllCountries(options);
      } catch (e) {
        if (e instanceof HttpException) {
          expect(e.getStatus()).toBe(HttpStatus.NO_CONTENT);
          expect(e.getResponse()).toBe('No content');
        } else {
          throw e;
        }
      }
    });
  });

  it('should return a country DTO when country is found and exclude all', async () => {
    const mockCountries = [
      {
        name: 'Chile',
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
        tld: '.c1',
      },
    ];

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCountries as any);
    const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
    const result = await service.getCountryByName("Cote D'Ivoire (Ivory Coast)", options);

    const countryDto: CountryDto = plainToInstance(CountryDto, result, {
      excludeExtraneousValues: true,
    });

    expect(result).toEqual(countryDto);
  });

  it('should return a country DTO when capital is found and exclude all', async () => {
    const mockCountries = [
      {
        name: 'Chile',
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
        tld: '.c1',
      },
    ];

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCountries as any);
    const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
    const result = await service.getCountryByCapital('Santiago', options);

    const countryDto: CountryDto = plainToInstance(CountryDto, result, {
      excludeExtraneousValues: true,
    });

    expect(result).toEqual(countryDto);
  });

  it('should throw No Content exception when country is not found', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    try {
      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await service.getCountryByName('Nonexistent Country', options);
    } catch (e) {
      if (e instanceof HttpException) {
        expect(e.getStatus()).toBe(HttpStatus.NO_CONTENT);
        expect(e.getResponse()).toBe('No content');
      } else {
        fail('Expected an HttpException');
      }
    }
  });

  it('should throw No Content exception when capital is not found', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

    try {
      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await service.getCountryByCapital('Nonexistent Capital', options);
    } catch (e) {
      if (e instanceof HttpException) {
        expect(e.getStatus()).toBe(HttpStatus.NO_CONTENT);
        expect(e.getResponse()).toBe('No content');
      } else {
        fail('Expected an HttpException');
      }
    }
  });

  it('should throw No Content exception when region is not found', async () => {
    jest.spyOn(repository, 'findAllBy').mockResolvedValue([]);

    try {
      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await service.getCountryByRegion('Nonexistent region', options);
    } catch (e) {
      if (e instanceof HttpException) {
        expect(e.getStatus()).toBe(HttpStatus.NO_CONTENT);
        expect(e.getResponse()).toBe('No content');
      } else {
        fail('Expected an HttpException');
      }
    }
  });

  it('should throw No Content exception when subregion is not found', async () => {
    jest.spyOn(repository, 'findAllBy').mockResolvedValue([]);

    try {
      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await service.getCountryBySubregion('Nonexistent subregion', options);
    } catch (e) {
      if (e instanceof HttpException) {
        expect(e.getStatus()).toBe(HttpStatus.NO_CONTENT);
        expect(e.getResponse()).toBe('No content');
      } else {
        fail('Expected an HttpException');
      }
    }
  });

  it('should return a list of countries by region', async () => {
    const mockCountries = [
      {
        name: 'Chile',
        capital: 'Capital 1',
        code: 'C1',
        currency: { symbol: 'C$', code: 'C1', name: 'Currency 1' },
        flags: { ico: 'icon', alt: 'flag', png: 'png', svg: 'svg' },
        iso3: 'C1C',
        latitude: 10,
        longitude: 20,
        phone_code: '+1',
        region: 'Americas',
        subregion: 'Subregion 1',
        tld: '.c1',
      },
    ];

    jest.spyOn(repository, 'findAllBy').mockResolvedValue(mockCountries as any);
    const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
    const countries = await service.getCountryByRegion('americas', options);
    expect(countries).toEqual(plainToInstance(CountryDto, countries, { excludeExtraneousValues: true }));
  });

  it('should return a list of countries by subregion', async () => {
    const mockCountries = [
      {
        name: 'Chile',
        capital: 'Capital 1',
        code: 'C1',
        currency: { symbol: 'C$', code: 'C1', name: 'Currency 1' },
        flags: { ico: 'icon', alt: 'flag', png: 'png', svg: 'svg' },
        iso3: 'C1C',
        latitude: 10,
        longitude: 20,
        phone_code: '+1',
        region: 'Americas',
        subregion: 'Subregion 1',
        tld: '.c1',
      },
    ];

    jest.spyOn(repository, 'findAllBy').mockResolvedValue(mockCountries as any);
    const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
    const countries = await service.getCountryBySubregion('Subregion 1', options);
    expect(countries).toEqual(plainToInstance(CountryDto, countries, { excludeExtraneousValues: true }));
  });
});
