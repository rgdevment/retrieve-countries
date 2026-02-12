import { CacheModule } from '@nestjs/cache-manager';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { gzipSync } from 'zlib';
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
            findAllCountriesGzip: jest.fn(),
            findCountryByTerm: jest.fn(),
            findCountriesByRegion: jest.fn(),
            findCountriesBySubregion: jest.fn(),
            findStateById: jest.fn(),
            findCityById: jest.fn(),
            search: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(60000),
          },
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  describe('findAll', () => {
    const mockRes = () => {
      const res: any = {};
      res.set = jest.fn().mockReturnValue(res);
      res.status = jest.fn().mockReturnValue(res);
      res.send = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should send gzip-compressed response with correct headers', () => {
      const gzip = gzipSync(JSON.stringify([mockCountryDto]));
      jest.spyOn(service, 'findAllCountriesGzip').mockReturnValue({ gzip, count: 1 });

      const res = mockRes();
      controller.findAll(undefined, undefined, res);

      expect(res.set).toHaveBeenCalledWith({
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
        'Cache-Control': 'public, max-age=60',
      });
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(gzip);
    });

    it('should propagate NO_CONTENT', () => {
      jest.spyOn(service, 'findAllCountriesGzip').mockImplementation(() => {
        throw new HttpException('No content', HttpStatus.NO_CONTENT);
      });
      const res = mockRes();
      expect(() => controller.findAll(undefined, undefined, res)).toThrow(HttpException);
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
