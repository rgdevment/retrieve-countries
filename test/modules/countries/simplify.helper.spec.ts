import { ExcludeOption } from '../../../src/modules/countries/dto/country-query.dto';
import {
  CityEntity,
  CountryEntity,
  StateEntity,
} from '../../../src/modules/countries/entities';
import {
  parseExclude,
  toSimpleCity,
  toSimpleCountry,
  toSimpleState,
} from '../../../src/modules/countries/helpers/simplify';

describe('simplify helpers', () => {
  describe('parseExclude', () => {
    it('should include everything by default', () => {
      expect(parseExclude()).toEqual({
        includeStates: true,
        includeCities: true,
      });
    });

    it('should exclude states and cities when STATES', () => {
      expect(parseExclude(ExcludeOption.STATES)).toEqual({
        includeStates: false,
        includeCities: false,
      });
    });

    it('should exclude only cities when CITIES', () => {
      expect(parseExclude(ExcludeOption.CITIES)).toEqual({
        includeStates: true,
        includeCities: false,
      });
    });

    it('should include everything for undefined', () => {
      expect(parseExclude(undefined)).toEqual({
        includeStates: true,
        includeCities: true,
      });
    });
  });

  describe('toSimpleCity', () => {
    it('should keep only id and name', () => {
      const city: CityEntity = {
        id: 1,
        name: 'Santiago',
        state_code: 'RM',
        country_code: 'CL',
        latitude: -33.45,
        longitude: -70.66,
        wikiDataId: 'Q2887',
      };
      expect(toSimpleCity(city)).toEqual({ id: 1, name: 'Santiago' });
    });
  });

  describe('toSimpleState', () => {
    it('should keep id, name, iso2 and simplify cities', () => {
      const state: StateEntity = {
        id: 10,
        name: 'Valparaiso',
        iso2: 'VS',
        type: 'region',
        country_code: 'CL',
        fips_code: '',
        level: null,
        parent_id: null,
        native: '',
        latitude: -33.0,
        longitude: -71.6,
        wikiDataId: '',
        cities: [
          {
            id: 1,
            name: 'Vina del Mar',
            state_code: 'VS',
            country_code: 'CL',
            latitude: -33.02,
            longitude: -71.55,
            wikiDataId: '',
          },
        ],
      };

      expect(toSimpleState(state)).toEqual({
        id: 10,
        name: 'Valparaiso',
        iso2: 'VS',
        cities: [{ id: 1, name: 'Vina del Mar' }],
      });
    });

    it('should default to empty cities when undefined', () => {
      const state = {
        id: 10,
        name: 'Test',
        iso2: 'TS',
      } as unknown as StateEntity;

      expect(toSimpleState(state)).toEqual({
        id: 10,
        name: 'Test',
        iso2: 'TS',
        cities: [],
      });
    });
  });

  describe('toSimpleCountry', () => {
    const baseCountry: CountryEntity = {
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
      latitude: -30,
      longitude: -71,
      emoji: 'CL_FLAG',
      emojiU: 'U+1F1E8 U+1F1F1',
      timezones: [],
      translations: null,
      wikiDataId: 'Q298',
      currency: { name: 'Chilean peso', code: 'CLP', symbol: '$' },
      states: [
        {
          id: 10,
          name: 'Valparaiso',
          iso2: 'VS',
          type: 'region',
          country_code: 'CL',
          fips_code: '',
          level: null,
          parent_id: null,
          native: '',
          latitude: -33.0,
          longitude: -71.6,
          wikiDataId: '',
          cities: [],
        },
      ],
    };

    it('should keep only simple fields and simplify states', () => {
      expect(toSimpleCountry(baseCountry)).toEqual({
        id: 44,
        name: 'Chile',
        iso2: 'CL',
        emoji: 'CL_FLAG',
        states: [{ id: 10, name: 'Valparaiso', iso2: 'VS', cities: [] }],
      });
    });

    it('should default to empty states when undefined', () => {
      const country = {
        ...baseCountry,
        states: undefined,
      } as unknown as CountryEntity;
      expect(toSimpleCountry(country)).toEqual({
        id: 44,
        name: 'Chile',
        iso2: 'CL',
        emoji: 'CL_FLAG',
        states: [],
      });
    });
  });
});
