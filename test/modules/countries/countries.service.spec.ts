import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryRepository } from '../../../src/modules/countries/repositories/country.repository.interface';
import { CountryDto } from '../../../src/common/dto/country.dto';

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
            findByField: jest.fn(),
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

      const countries = await service.getAllCountries(true, true);
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

      const countries = await service.getAllCountries(false, true);
      expect(countries).toEqual(plainToInstance(CountryDto, countries, { excludeExtraneousValues: true }));
    });

    it('should throw no content exception if no countries are found', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);

      try {
        await service.getAllCountries(true, true);
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

    jest.spyOn(repository, 'findByField').mockResolvedValue(mockCountries as any);

    const result = await service.getCountryByName("Cote D'Ivoire (Ivory Coast)", true, true);

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

    jest.spyOn(repository, 'findByField').mockResolvedValue(mockCountries as any);

    const result = await service.getCountryByCapital('Santiago', true, true);

    const countryDto: CountryDto = plainToInstance(CountryDto, result, {
      excludeExtraneousValues: true,
    });

    expect(result).toEqual(countryDto);
  });

  it('should throw No Content exception when country is not found', async () => {
    jest.spyOn(repository, 'findByField').mockResolvedValue(null);

    try {
      await service.getCountryByName('Nonexistent Country', false, false);
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
    jest.spyOn(repository, 'findByField').mockResolvedValue(null);

    try {
      await service.getCountryByCapital('Nonexistent Capital', false, false);
    } catch (e) {
      if (e instanceof HttpException) {
        expect(e.getStatus()).toBe(HttpStatus.NO_CONTENT);
        expect(e.getResponse()).toBe('No content');
      } else {
        fail('Expected an HttpException');
      }
    }
  });
});
