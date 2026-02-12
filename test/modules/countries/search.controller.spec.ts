import { CountriesService } from '../../../src/modules/countries/countries.service';
import { SearchResult } from '../../../src/modules/countries/repositories/country.repository.interface';
import { SearchController } from '../../../src/modules/countries/search.controller';
import { createControllerTestModule } from '../../helpers/controller-test.helper';

describe('SearchController', () => {
  let controller: SearchController;
  let service: CountriesService;

  const mockSearchResult: SearchResult = {
    countries: [
      { id: 44, name: 'Chile', iso2: 'CL', emoji: '🇨🇱', states: [] },
      { id: 45, name: 'China', iso2: 'CN', emoji: '🇨🇳', states: [] },
    ],
    states: [
      {
        id: 2113,
        name: 'Chiapas',
        iso2: 'CHP',
        country_name: 'Mexico',
        country_iso2: 'MX',
      },
    ],
    cities: [
      {
        id: 21553,
        name: 'Chicago',
        state_name: 'Illinois',
        country_name: 'United States',
        country_iso2: 'US',
      },
    ],
  };

  beforeEach(async () => {
    const ctx = await createControllerTestModule(SearchController, {
      search: jest.fn(),
    });
    controller = ctx.controller;
    service = ctx.service;
  });

  describe('search', () => {
    it('should return search results for valid query', async () => {
      jest.spyOn(service, 'search').mockResolvedValue(mockSearchResult);

      const result = await controller.search('chi');

      expect(result).toEqual(mockSearchResult);
      expect(service.search).toHaveBeenCalledWith('chi');
    });

    it('should return empty results when nothing matches', async () => {
      const emptyResult: SearchResult = {
        countries: [],
        states: [],
        cities: [],
      };
      jest.spyOn(service, 'search').mockResolvedValue(emptyResult);

      const result = await controller.search('zzzzz');

      expect(result).toEqual(emptyResult);
      expect(service.search).toHaveBeenCalledWith('zzzzz');
    });

    it('should handle short queries', async () => {
      jest.spyOn(service, 'search').mockResolvedValue(mockSearchResult);

      const result = await controller.search('ch');

      expect(result).toEqual(mockSearchResult);
      expect(service.search).toHaveBeenCalledWith('ch');
    });
  });
});
