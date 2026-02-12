import { CitiesController } from '../../../src/modules/countries/cities.controller';
import { CountriesService } from '../../../src/modules/countries/countries.service';
import { MOCK_CITY } from '../../fixtures/country.fixtures';
import { createControllerTestModule } from '../../helpers/controller-test.helper';

describe('CitiesController', () => {
  let controller: CitiesController;
  let service: CountriesService;

  beforeEach(async () => {
    const ctx = await createControllerTestModule(CitiesController, {
      findCityById: jest.fn(),
    });
    controller = ctx.controller;
    service = ctx.service;
  });

  describe('findById', () => {
    it('should return a city by id', async () => {
      jest.spyOn(service, 'findCityById').mockResolvedValue(MOCK_CITY);

      const result = await controller.findById(21553);

      expect(result).toEqual(MOCK_CITY);
      expect(service.findCityById).toHaveBeenCalledWith(21553);
    });

    it('should handle city not found', async () => {
      jest.spyOn(service, 'findCityById').mockResolvedValue(null as any);

      const result = await controller.findById(999999);

      expect(result).toBeNull();
      expect(service.findCityById).toHaveBeenCalledWith(999999);
    });
  });
});
