import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { CountriesController } from '../../../src/modules/countries/countries.controller';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { CountryDto } from '../../../src/common/dto/country.dto';

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

      const response = await controller.getAllCountries('true');
      expect(response).toEqual(result);
    });

    it('should return 204 No Content when no countries are found', async () => {
      jest.spyOn(service, 'getAllCountries').mockResolvedValue([]);

      try {
        await controller.getAllCountries('true');
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
});
