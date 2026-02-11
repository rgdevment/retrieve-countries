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
    id: 44,
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
        id: 2113,
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
          {
            id: 21553,
            name: 'Calama',
            state_code: 'AN',
            country_code: 'CL',
            latitude: -22.46,
            longitude: -68.93,
            wikiDataId: '',
          },
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
            findAllCountries: jest.fn(),
            findCountryByTerm: jest.fn(),
            findCountriesByRegion: jest.fn(),
            findCountriesBySubregion: jest.fn(),
            findStateById: jest.fn(),
            findCityById: jest.fn(),
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  describe('findAll', () => {
    it('should return all countries with states and cities', async () => {
      jest.spyOn(service, 'findAllCountries').mockResolvedValue([mockCountryDto]);

      const result = await controller.findAll();

      expect(result).toEqual([mockCountryDto]);
      expect((result as CountryEntity[])[0].states).toHaveLength(1);
      expect((result as CountryEntity[])[0].states[0].cities).toHaveLength(1);
    });

    it('should propagate NO_CONTENT', async () => {
      jest.spyOn(service, 'findAllCountries').mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));
      await expect(controller.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findByTerm', () => {
    it('should return a country by name', async () => {
      jest.spyOn(service, 'findCountryByTerm').mockResolvedValue(mockCountryDto);

      const result = await controller.findByTerm('Chile');

      expect(result).toEqual(mockCountryDto);
      expect(service.findCountryByTerm).toHaveBeenCalledWith('Chile', undefined, undefined);
    });

    it('should propagate NO_CONTENT', async () => {
      jest
        .spyOn(service, 'findCountryByTerm')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));
      await expect(controller.findByTerm('Unknown')).rejects.toThrow(HttpException);
    });
  });

  describe('findByRegion', () => {
    it('should return countries in the specified region', async () => {
      jest.spyOn(service, 'findCountriesByRegion').mockResolvedValue([mockCountryDto]);

      const result = await controller.findByRegion('Americas');

      expect(result).toEqual([mockCountryDto]);
      expect(service.findCountriesByRegion).toHaveBeenCalledWith('Americas', undefined, undefined);
    });

    it('should propagate NO_CONTENT', async () => {
      jest
        .spyOn(service, 'findCountriesByRegion')
        .mockRejectedValue(new HttpException('No content', HttpStatus.NO_CONTENT));
      await expect(controller.findByRegion('Unknown')).rejects.toThrow(HttpException);
    });
  });
});
