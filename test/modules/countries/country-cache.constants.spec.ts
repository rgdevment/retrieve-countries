import { join } from 'node:path';
import {
  ALL_CACHE_COMBOS,
  CACHE_DIR,
  getCacheFileName,
} from '../../../src/modules/countries/cache/country-cache.constants';
import { ExcludeOption, ResponseType } from '../../../src/modules/countries/dto/country-query.dto';

describe('country-cache.constants', () => {
  describe('CACHE_DIR', () => {
    it('should point to data/cache under cwd', () => {
      expect(CACHE_DIR).toBe(join(process.cwd(), 'data', 'cache'));
    });
  });

  describe('getCacheFileName', () => {
    it('returns full filename when no type and no exclude', () => {
      expect(getCacheFileName()).toBe('countries-full.json.gz');
      expect(getCacheFileName(undefined, undefined)).toBe('countries-full.json.gz');
    });

    it('returns full filename with FULL type', () => {
      expect(getCacheFileName(ResponseType.FULL)).toBe('countries-full.json.gz');
    });

    it('returns simple filename when type is SIMPLE', () => {
      expect(getCacheFileName(ResponseType.SIMPLE)).toBe('countries-simple.json.gz');
    });

    it('returns filename with exclude-states suffix', () => {
      expect(getCacheFileName(undefined, ExcludeOption.STATES)).toBe('countries-full-exclude-states.json.gz');
    });

    it('returns filename with exclude-cities suffix', () => {
      expect(getCacheFileName(undefined, ExcludeOption.CITIES)).toBe('countries-full-exclude-cities.json.gz');
    });

    it('returns simple + exclude-states', () => {
      expect(getCacheFileName(ResponseType.SIMPLE, ExcludeOption.STATES)).toBe(
        'countries-simple-exclude-states.json.gz',
      );
    });

    it('returns simple + exclude-cities', () => {
      expect(getCacheFileName(ResponseType.SIMPLE, ExcludeOption.CITIES)).toBe(
        'countries-simple-exclude-cities.json.gz',
      );
    });
  });

  describe('ALL_CACHE_COMBOS', () => {
    it('should have 6 combos', () => {
      expect(ALL_CACHE_COMBOS).toHaveLength(6);
    });

    it('should cover all type/exclude permutations', () => {
      const keys = ALL_CACHE_COMBOS.map(c => (c.type ?? 'undefined') + '-' + (c.exclude ?? 'undefined'));

      expect(keys).toContain('undefined-undefined');
      expect(keys).toContain('undefined-' + ExcludeOption.CITIES);
      expect(keys).toContain('undefined-' + ExcludeOption.STATES);
      expect(keys).toContain(ResponseType.SIMPLE + '-undefined');
      expect(keys).toContain(ResponseType.SIMPLE + '-' + ExcludeOption.CITIES);
      expect(keys).toContain(ResponseType.SIMPLE + '-' + ExcludeOption.STATES);
    });
  });
});
