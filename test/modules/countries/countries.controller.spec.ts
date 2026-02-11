import { CacheModule } from '@nestjs/cache-manager';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CountryQueryDto } from '../../../src/common/dto/country-query.dto';
import { CountryDto } from '../../../src/common/dto/country.dto';
import { CountriesController } from '../../../src/modules/countries/countries.controller';
import { CountriesService } from '../../../src/modules/countries/countries.service';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  const mockCountryDto: CountryDto = {
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
    currency: { symbol: 'C$', code: 'CLP', name: 'Chilean Peso' },
    flags: { ico: '🇨🇱', alt: 'Chile Flag', png: 'png_url', svg: 'svg_url' },
    states: [
      {
        name: 'Antofagasta',
        code: 'AN',
        country_code: 'CL',
        latitude: -23.65,
        longitude: -70.4,
      },
    ],
  };

  const mockQuery: CountryQueryDto = {
    excludeStates: false,
    excludeCities: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: {
            getAllCountries: jest.fn(),
            getCountryByName: jest.fn(),
            getCountryByCapital: jest.fn(),
            getCountryByRegion: jest.fn(),
            getCountryBySubregion: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  describe('getAllCountries', () => {
    it('should return a list of countries', async () => {
      jest.spyOn(service, 'getAllCountries').mockResolvedValue([mockCountryDto]);

      const result = await controller.getAllCountries(mockQuery);

      expect(result).toEqual([mockCountryDto]);
      expect(service.getAllCountries).toHaveBeenCalledWith(mockQuery);
    });

    it('should throw No Content exception when no countries are found', async () => {
      jest.spyOn(service, 'getAllCountries').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getAllCountries(mockQuery)).rejects.toThrow(HttpException);
    });
  });

  describe('getCountryByName', () => {
    it('should return a country when found', async () => {
      jest.spyOn(service, 'getCountryByName').mockResolvedValue(mockCountryDto);

      const result = await controller.getCountryByName('Chile', mockQuery);

      expect(result).toEqual(mockCountryDto);
      expect(service.getCountryByName).toHaveBeenCalledWith('Chile', mockQuery);
    });

    it('should throw No Content when country not found', async () => {
      jest.spyOn(service, 'getCountryByName').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryByName('Unknown', mockQuery)).rejects.toThrow(HttpException);
    });
  });

  describe('getCountryByCapital', () => {
    it('should return a country when found by capital', async () => {
      jest.spyOn(service, 'getCountryByCapital').mockResolvedValue(mockCountryDto);

      const result = await controller.getCountryByCapital('Santiago', mockQuery);

      expect(result).toEqual(mockCountryDto);
    });

    it('should throw No Content when capital not found', async () => {
      jest
        .spyOn(service, 'getCountryByCapital')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryByCapital('Unknown', mockQuery)).rejects.toThrow(HttpException);
    });
  });

  describe('getCountryByRegion', () => {
    it('should return countries by region', async () => {
      jest.spyOn(service, 'getCountryByRegion').mockResolvedValue([mockCountryDto]);

      const result = await controller.getCountryByRegion('Americas', mockQuery);

      expect(result).toEqual([mockCountryDto]);
    });

    it('should throw No Content when region not found', async () => {
      jest
        .spyOn(service, 'getCountryByRegion')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryByRegion('Unknown', mockQuery)).rejects.toThrow(HttpException);
    });
  });

  describe('getCountryBySubregion', () => {
    it('should return countries by subregion', async () => {
      jest.spyOn(service, 'getCountryBySubregion').mockResolvedValue([mockCountryDto]);

      const result = await controller.getCountryBySubregion('South America', mockQuery);

      expect(result).toEqual([mockCountryDto]);
    });

    it('should throw No Content when subregion not found', async () => {
      jest
        .spyOn(service, 'getCountryBySubregion')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryBySubregion('Unknown', mockQuery)).rejects.toThrow(HttpException);
    });
  });
});
