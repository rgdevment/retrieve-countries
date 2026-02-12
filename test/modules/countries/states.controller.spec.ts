import { CountriesService } from '../../../src/modules/countries/countries.service';
import { StatesController } from '../../../src/modules/countries/states.controller';
import { MOCK_STATE, MOCK_STATE_NO_CITIES } from '../../fixtures/country.fixtures';
import { createControllerTestModule } from '../../helpers/controller-test.helper';

describe('StatesController', () => {
  let controller: StatesController;
  let service: CountriesService;

  beforeEach(async () => {
    const ctx = await createControllerTestModule(StatesController, {
      findStateById: jest.fn(),
    });
    controller = ctx.controller;
    service = ctx.service;
  });

  describe('findById', () => {
    it('should return a state with cities by default', async () => {
      jest.spyOn(service, 'findStateById').mockResolvedValue(MOCK_STATE);

      const result = await controller.findById(2113);

      expect(result).toEqual(MOCK_STATE);
      expect(service.findStateById).toHaveBeenCalledWith(2113, false);
    });

    it('should return a state without cities when exclude=cities', async () => {
      jest.spyOn(service, 'findStateById').mockResolvedValue(MOCK_STATE_NO_CITIES);

      const result = await controller.findById(2113, 'cities');

      expect(result).toEqual(MOCK_STATE_NO_CITIES);
      expect(service.findStateById).toHaveBeenCalledWith(2113, true);
    });

    it('should handle state not found', async () => {
      jest.spyOn(service, 'findStateById').mockResolvedValue(null as any);

      const result = await controller.findById(999999);

      expect(result).toBeNull();
      expect(service.findStateById).toHaveBeenCalledWith(999999, false);
    });
  });
});
