import { CityRow, CountryRow, RegionRow, StateRow, SubregionRow } from '../../../src/database';
import { CityEntity } from '../../../src/modules/countries/entities';
import {
  toCityEntity,
  toCountrySimple,
  toRegionEntity,
  toStateEntity,
  toSubregionEntity,
} from '../../../src/modules/countries/mappers/country.mapper';

describe('Country Mappers', () => {
  describe('toRegionEntity', () => {
    it('should map a RegionRow to RegionEntity', () => {
      const row: RegionRow = {
        id: 1,
        name: 'Americas',
        translations: '{"es":"Americas"}',
        wikiDataId: 'Q828',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toRegionEntity(row);
      expect(result).toEqual({
        name: 'Americas',
        translations: { es: 'Americas' },
        wikiDataId: 'Q828',
      });
    });

    it('should handle null translations', () => {
      const row: RegionRow = {
        id: 2,
        name: 'Europe',
        translations: null,
        wikiDataId: 'Q46',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toRegionEntity(row);
      expect(result).toEqual({
        name: 'Europe',
        translations: null,
        wikiDataId: 'Q46',
      });
    });

    it('should handle empty translations string', () => {
      const row: RegionRow = {
        id: 3,
        name: 'Africa',
        translations: '',
        wikiDataId: 'Q15',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toRegionEntity(row);
      expect(result).toEqual({
        name: 'Africa',
        translations: null,
        wikiDataId: 'Q15',
      });
    });
  });

  describe('toSubregionEntity', () => {
    it('should map a SubregionRow to SubregionEntity', () => {
      const row: SubregionRow = {
        id: 1,
        name: 'South America',
        translations: '{"es":"Sudamerica"}',
        region_id: 2,
        wikiDataId: 'Q18',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toSubregionEntity(row);
      expect(result).toEqual({
        name: 'South America',
        translations: { es: 'Sudamerica' },
        wikiDataId: 'Q18',
      });
    });
  });

  describe('toCountrySimple', () => {
    it('should map a CountryRow to CountrySimpleEntity', () => {
      const row: CountryRow = {
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
        region_id: 2,
        subregion_id: 7,
        region: 'Americas',
        subregion: 'South America',
        latitude: -30,
        longitude: -71,
        emoji: 'CL_FLAG',
        emojiU: 'U+1F1E8 U+1F1F1',
        timezones: '[]',
        translations: '{}',
        wikiDataId: 'Q298',
        currency_name: 'Chilean peso',
        currency_symbol: '$',
        currency: 'CLP',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toCountrySimple(row);
      expect(result).toEqual({
        id: 44,
        name: 'Chile',
        iso2: 'CL',
        emoji: 'CL_FLAG',
        states: [],
      });
    });
  });

  describe('toStateEntity', () => {
    it('should map StateRow with cities', () => {
      const cities: CityEntity[] = [
        {
          id: 21553,
          name: 'Calama',
          latitude: -22.45667,
          longitude: -68.92371,
          state_code: 'AN',
          country_code: 'CL',
          wikiDataId: 'Q53747',
        },
      ];
      const row: StateRow = {
        id: 2113,
        name: 'Antofagasta',
        iso2: 'AN',
        type: 'region',
        country_id: 44,
        country_code: 'CL',
        fips_code: '',
        level: null,
        parent_id: null,
        native: '',
        latitude: -23.65,
        longitude: -70.4,
        wikiDataId: '',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toStateEntity(row, cities);
      expect(result).toEqual({
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
        cities,
      });
    });

    it('should handle empty cities', () => {
      const row: StateRow = {
        id: 2113,
        name: 'Antofagasta',
        iso2: 'AN',
        type: 'region',
        country_id: 44,
        country_code: 'CL',
        fips_code: '',
        level: null,
        parent_id: null,
        native: '',
        latitude: -23.65,
        longitude: -70.4,
        wikiDataId: '',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toStateEntity(row, []);
      expect(result.cities).toEqual([]);
    });
  });

  describe('toCityEntity', () => {
    it('should map a CityRow to CityEntity', () => {
      const row: CityRow = {
        id: 21553,
        name: 'Calama',
        state_id: 2113,
        state_code: 'AN',
        country_id: 44,
        country_code: 'CL',
        latitude: -22.45667,
        longitude: -68.92371,
        wikiDataId: 'Q53747',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toCityEntity(row);
      expect(result).toEqual({
        id: 21553,
        name: 'Calama',
        state_code: 'AN',
        country_code: 'CL',
        latitude: -22.45667,
        longitude: -68.92371,
        wikiDataId: 'Q53747',
      });
    });

    it('should handle zero coordinates', () => {
      const row: CityRow = {
        id: 1,
        name: 'Test',
        state_id: 1,
        state_code: 'TS',
        country_id: 1,
        country_code: 'TC',
        latitude: 0,
        longitude: 0,
        wikiDataId: '',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
        flag: 1,
      };
      const result = toCityEntity(row);
      expect(result.latitude).toBe(0);
      expect(result.longitude).toBe(0);
    });
  });
});
