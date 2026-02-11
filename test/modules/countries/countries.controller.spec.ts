import { CacheModule } from '@nestjs/cache-manager';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from '../../../src/modules/countries/countries.controller';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryEntity } from '../../../src/modules/countries/entities';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  const mockCountryDto: CountryEntity = {
    name: 'Chile',
    iso2: 'CL',
    iso3: 'CHL',
    numeric_code: '152',
    capital: 'Santiago',
    phonecode: '56',
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
        cities: [
          { name: 'Calama', state_code: 'AN', country_code: 'CL', latitude: -22.46, longitude: -68.93, wikiDataId: '' },
        ],
      },
    ],
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
            getCountryByStateName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  describe('getAllCountries', () => {
    it('should return all countries with states and cities', async () => {
      jest.spyOn(service, 'getAllCountries').mockResolvedValue([mockCountryDto]);

      const result = await controller.getAllCountries();

      expect(result).toEqual([mockCountryDto]);
      expect(result[0].states).toHaveLength(1);
      expect(result[0].states[0].cities).toHaveLength(1);
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

  describe('getCountryByStateName', () => {
    it('should return the country containing the state', async () => {
      jest.spyOn(service, 'getCountryByStateName').mockResolvedValue(mockCountryDto);

      const result = await controller.getCountryByStateName('Antofagasta');

      expect(result).toEqual(mockCountryDto);
      expect(result.states).toHaveLength(1);
      expect(service.getCountryByStateName).toHaveBeenCalledWith('Antofagasta');
    });

    it('should propagate NO_CONTENT', async () => {
      jest
        .spyOn(service, 'getCountryByStateName')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));
      await expect(controller.getCountryByStateName('Unknown')).rejects.toThrow(HttpException);
    });
  });
});
