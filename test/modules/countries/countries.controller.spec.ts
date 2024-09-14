import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CountriesController } from '../../../src/modules/countries/countries.controller';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryDto } from '../../../src/common/dto/country.dto';
import { plainToInstance } from 'class-transformer';
import { CountriesQueryDto } from '../../../src/common/dto/countries-query.dto';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  // Datos de prueba comunes
  const mockCountry: CountryDto = {
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

  const mockCountryDto = plainToInstance(CountryDto, mockCountry, {
    excludeExtraneousValues: true,
  });

  const mockCountriesList: CountryDto[] = [mockCountryDto];

  const mockQuery: CountriesQueryDto = { excludeStates: false, excludeCities: false };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      jest.spyOn(service, 'getAllCountries').mockResolvedValue(mockCountriesList);

      const response = await controller.getAllCountries(mockQuery);

      expect(response).toEqual(mockCountriesList);
      expect(service.getAllCountries).toHaveBeenCalledWith(mockQuery);
    });

    it('should throw No Content exception when no countries are found', async () => {
      jest.spyOn(service, 'getAllCountries').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getAllCountries(mockQuery)).rejects.toThrowError(
        new HttpException('No content', HttpStatus.NO_CONTENT),
      );
    });
  });

  describe('getCountryByName', () => {
    it('should return a country DTO when country is found', async () => {
      jest.spyOn(service, 'getCountryByName').mockResolvedValue(mockCountryDto);

      const result = await controller.getCountryByName(mockCountry.name, mockQuery);

      expect(result).toEqual(mockCountryDto);
      expect(service.getCountryByName).toHaveBeenCalledWith(mockCountry.name, mockQuery);
    });

    it('should throw No Content exception when country is not found', async () => {
      jest.spyOn(service, 'getCountryByName').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryByName('Nonexistent Country', mockQuery)).rejects.toThrowError(
        new HttpException('No content', HttpStatus.NO_CONTENT),
      );
    });
  });

  describe('getCountryByCapital', () => {
    it('should return a country DTO when country is found by capital', async () => {
      jest.spyOn(service, 'getCountryByCapital').mockResolvedValue(mockCountryDto);

      const result = await controller.getCountryByCapital(mockCountry.capital, mockQuery);

      expect(result).toEqual(mockCountryDto);
      expect(service.getCountryByCapital).toHaveBeenCalledWith(mockCountry.capital, mockQuery);
    });

    it('should throw No Content exception when capital is not found', async () => {
      jest
        .spyOn(service, 'getCountryByCapital')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryByCapital('Nonexistent Capital', mockQuery)).rejects.toThrowError(
        new HttpException('No content', HttpStatus.NO_CONTENT),
      );
    });
  });

  describe('getCountryByRegion', () => {
    it('should return a list of countries by region', async () => {
      jest.spyOn(service, 'getCountryByRegion').mockResolvedValue(mockCountriesList);

      const response = await controller.getCountryByRegion(mockCountry.region, mockQuery);

      expect(response).toEqual(mockCountriesList);
      expect(service.getCountryByRegion).toHaveBeenCalledWith(mockCountry.region, mockQuery);
    });

    it('should throw No Content exception when region is not found', async () => {
      jest
        .spyOn(service, 'getCountryByRegion')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryByRegion('Nonexistent Region', mockQuery)).rejects.toThrowError(
        new HttpException('No content', HttpStatus.NO_CONTENT),
      );
    });
  });

  describe('getCountryBySubregion', () => {
    it('should return a list of countries by subregion', async () => {
      jest.spyOn(service, 'getCountryBySubregion').mockResolvedValue(mockCountriesList);

      const response = await controller.getCountryBySubregion(mockCountry.subregion, mockQuery);

      expect(response).toEqual(mockCountriesList);
      expect(service.getCountryBySubregion).toHaveBeenCalledWith(mockCountry.subregion, mockQuery);
    });

    it('should throw No Content exception when subregion is not found', async () => {
      jest
        .spyOn(service, 'getCountryBySubregion')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));

      await expect(controller.getCountryBySubregion('Nonexistent Subregion', mockQuery)).rejects.toThrowError(
        new HttpException('No content', HttpStatus.NO_CONTENT),
      );
    });
  });
});
