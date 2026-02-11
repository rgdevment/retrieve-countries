import { CacheModule } from '@nestjs/cache-manager';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from '../../../src/modules/countries/countries.controller';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryDto } from '../../../src/modules/countries/dto/country.dto';
import { StateDto } from '../../../src/modules/countries/dto/state.dto';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  const mockCountryDto: CountryDto = {
    name: 'Chile',
    iso2: 'CL',
    iso3: 'CHL',
    numeric_code: '152',
    capital: 'Santiago',
    phonecode: '56',
    nationality: 'Chilean',
    region: 'Americas',
    subregion: 'South America',
    latitude: -35.6751,
    longitude: -71.543,
    tld: '.cl',
    emoji: '🇨🇱',
    emojiU: 'U+1F1E8 U+1F1F1',
    currency: { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    states: [
      {
        name: 'Antofagasta',
        iso2: 'AN',
        type: 'region',
        country_code: 'CL',
        latitude: -23.65,
        longitude: -70.4,
        cities: [],
      },
    ],
  };

  const mockStateDto: StateDto = {
    name: 'Antofagasta',
    iso2: 'AN',
    type: 'region',
    country_code: 'CL',
    latitude: -23.65,
    longitude: -70.4,
    cities: [{ name: 'Calama', state_code: 'AN', country_code: 'CL', latitude: -22.46, longitude: -68.93 }],
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
            getStateByName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  describe('getAllCountries', () => {
    it('should return all countries', async () => {
      jest.spyOn(service, 'getAllCountries').mockResolvedValue([mockCountryDto]);

      const result = await controller.getAllCountries();

      expect(result).toEqual([mockCountryDto]);
    });

    it('should propagate NO_CONTENT', async () => {
      jest.spyOn(service, 'getAllCountries').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));
      await expect(controller.getAllCountries()).rejects.toThrow(HttpException);
    });
  });

  describe('getCountryByName', () => {
    it('should return a country', async () => {
      jest.spyOn(service, 'getCountryByName').mockResolvedValue(mockCountryDto);

      const result = await controller.getCountryByName('Chile');

      expect(result).toEqual(mockCountryDto);
      expect(service.getCountryByName).toHaveBeenCalledWith('Chile');
    });

    it('should propagate NO_CONTENT', async () => {
      jest.spyOn(service, 'getCountryByName').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));
      await expect(controller.getCountryByName('Unknown')).rejects.toThrow(HttpException);
    });
  });

  describe('getStateByName', () => {
    it('should return a state with cities', async () => {
      jest.spyOn(service, 'getStateByName').mockResolvedValue(mockStateDto);

      const result = await controller.getStateByName('Antofagasta');

      expect(result).toEqual(mockStateDto);
      expect(service.getStateByName).toHaveBeenCalledWith('Antofagasta');
    });

    it('should propagate NO_CONTENT', async () => {
      jest.spyOn(service, 'getStateByName').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));
      await expect(controller.getStateByName('Unknown')).rejects.toThrow(HttpException);
    });
  });
});
