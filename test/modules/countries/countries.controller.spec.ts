import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CountriesController } from '../../../src/modules/countries/countries.controller';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryDto } from '../../../src/common/dto/country.dto';
import { plainToInstance } from 'class-transformer';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: {
            getAllCountries: jest.fn(),
            getCountryByName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  describe('getAllCountries', () => {
    it('should return a list of countries', async () => {
      const result: CountryDto[] = [
        {
          name: 'Chile',
          capital: 'Santiago',
          code: 'CL',
          currency: { symbol: 'C$', code: 'C1', name: 'Currency 1' },
          flags: { ico: 'icon', alt: 'flag', png: 'png', svg: 'svg' },
          iso3: 'C1C',
          latitude: 10,
          longitude: 20,
          phone_code: '+1',
          region: 'Region 1',
          states: [{ name: 'Antofagasta', code: 'AF', country_code: 'C1', latitude: 10, longitude: 20 }],
          subregion: 'Subregion 1',
          tld: '.cl',
        },
      ];

      jest.spyOn(service, 'getAllCountries').mockResolvedValue(result);

      const response = await controller.getAllCountries('true', 'true');
      expect(response).toEqual(result);
    });

    it('should return 204 No Content when no countries are found', async () => {
      jest.spyOn(service, 'getAllCountries').mockResolvedValue([]);

      try {
        await controller.getAllCountries('true', 'false');
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

  it('should return a country DTO when country is found', async () => {
    const country = {
      _id: '1',
      name: "Cote D'Ivoire (Ivory Coast)",
      capital: 'Yamoussoukro',
      code: 'CI',
      currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA franc' },
      flags: { ico: 'ico', alt: 'flag', png: 'png', svg: 'svg' },
      iso3: 'CIV',
      latitude: 7.539989,
      longitude: -5.54708,
      phone_code: '+225',
      region: 'Africa',
      subregion: 'Western Africa',
      tld: '.ci',
      cities: [],
      states: [],
    };

    const countryDto: CountryDto = plainToInstance(CountryDto, country, {
      excludeExtraneousValues: true,
    });

    jest.spyOn(service, 'getCountryByName').mockResolvedValue(countryDto);

    const result = await controller.getCountryByName("Cote D'Ivoire (Ivory Coast)", 'true', 'true');

    expect(result).toEqual(countryDto);
  });

  it("should return a country DTO when country is found and don't exclude cities", async () => {
    const country = {
      _id: '1',
      name: "Cote D'Ivoire (Ivory Coast)",
      capital: 'Yamoussoukro',
      code: 'CI',
      currency: { symbol: 'CFA', code: 'XOF', name: 'West African CFA franc' },
      flags: { ico: 'ico', alt: 'flag', png: 'png', svg: 'svg' },
      iso3: 'CIV',
      latitude: 7.539989,
      longitude: -5.54708,
      phone_code: '+225',
      region: 'Africa',
      subregion: 'Western Africa',
      tld: '.ci',
      cities: [{ name: 'Antofagasta', state_code: 'AF', country_code: 'C1', latitude: 10, longitude: 20 }],
      states: [{ name: 'Antofagasta', code: 'AF', country_code: 'C1', latitude: 10, longitude: 20 }],
    };

    const countryDto: CountryDto = plainToInstance(CountryDto, country, {
      excludeExtraneousValues: true,
    });

    jest.spyOn(service, 'getCountryByName').mockResolvedValue(countryDto);

    const result = await controller.getCountryByName("Cote D'Ivoire (Ivory Coast)", 'false', 'false');

    expect(result).toEqual(countryDto);
  });

  it('should return No Content status when country is not found', async () => {
    jest.spyOn(service, 'getCountryByName').mockResolvedValue(null);

    try {
      await controller.getCountryByName('Nonexistent Country', 'false', 'false');
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
