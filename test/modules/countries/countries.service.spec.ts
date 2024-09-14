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
    states: [{ name: 'Antofagasta', code: 'AN', country_code: 'CL', latitude: -23.65, longitude: -70.4 }],
    subregion: 'South America',
    tld: '.cl',
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

  const expectNoContentException = async (func: () => Promise<any>) => {
    await expect(func()).rejects.toThrowError(new HttpException('No content', HttpStatus.NO_CONTENT));
  };

  describe('getAllCountries', () => {
    it('should return a list of countries with states', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([mockCountry] as any);
      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const countries = await service.getAllCountries(options);

      const expected = plainToInstance(CountryDto, [mockCountry], { excludeExtraneousValues: true });

      expect(countries).toEqual(expected);
      expect(repository.findAll).toHaveBeenCalledWith(options);
    });

    it('should throw No Content exception if no countries are found', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);

      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      await expectNoContentException(() => service.getAllCountries(options));
      expect(repository.findAll).toHaveBeenCalledWith(options);
    });
  });

  describe('getCountryByName', () => {
    it('should return a country DTO when country is found and exclude all', async () => {
      const countryName = 'Chile';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCountry as any);
      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const result = await service.getCountryByName(countryName, options);

      const expected = plainToInstance(CountryDto, mockCountry, { excludeExtraneousValues: true });

      expect(result).toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith('name', countryName, options);
    });

    it('should throw No Content exception when country is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await expectNoContentException(() => service.getCountryByName('Nonexistent Country', options));
      expect(repository.findOneBy).toHaveBeenCalledWith('name', 'Nonexistent Country', options);
    });
  });

  describe('getCountryByCapital', () => {
    it('should return a country DTO when capital is found and exclude all', async () => {
      const capital = 'Santiago';
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockCountry as any);
      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const result = await service.getCountryByCapital(capital, options);

      const expected = plainToInstance(CountryDto, mockCountry, { excludeExtraneousValues: true });

      expect(result).toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledWith('capital', capital, options);
    });

    it('should throw No Content exception when capital is not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await expectNoContentException(() => service.getCountryByCapital('Nonexistent Capital', options));
      expect(repository.findOneBy).toHaveBeenCalledWith('capital', 'Nonexistent Capital', options);
    });
  });

  describe('getCountryByRegion', () => {
    it('should return a list of countries by region', async () => {
      const region = 'Americas';
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([mockCountry] as any);
      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const countries = await service.getCountryByRegion(region, options);

      const expected = plainToInstance(CountryDto, [mockCountry], { excludeExtraneousValues: true });

      expect(countries).toEqual(expected);
      expect(repository.findAllBy).toHaveBeenCalledWith('region', region, options);
    });

    it('should throw No Content exception when region is not found', async () => {
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([]);

      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await expectNoContentException(() => service.getCountryByRegion('Nonexistent Region', options));
      expect(repository.findAllBy).toHaveBeenCalledWith('region', 'Nonexistent Region', options);
    });
  });

  describe('getCountryBySubregion', () => {
    it('should return a list of countries by subregion', async () => {
      const subregion = 'South America';
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([mockCountry] as any);
      const options: ExcludeOptions = { excludeStates: true, excludeCities: true };
      const countries = await service.getCountryBySubregion(subregion, options);

      const expected = plainToInstance(CountryDto, [mockCountry], { excludeExtraneousValues: true });

      expect(countries).toEqual(expected);
      expect(repository.findAllBy).toHaveBeenCalledWith('subregion', subregion, options);
    });

    it('should throw No Content exception when subregion is not found', async () => {
      jest.spyOn(repository, 'findAllBy').mockResolvedValue([]);

      const options: ExcludeOptions = { excludeStates: false, excludeCities: false };
      await expectNoContentException(() => service.getCountryBySubregion('Nonexistent Subregion', options));
      expect(repository.findAllBy).toHaveBeenCalledWith('subregion', 'Nonexistent Subregion', options);
    });
  });
});
