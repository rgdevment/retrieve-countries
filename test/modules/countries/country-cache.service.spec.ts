import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'node:fs';
import * as zlib from 'node:zlib';
import { CountryCacheService } from '../../../src/modules/countries/cache/country-cache.service';
import { ExcludeOption, ResponseType } from '../../../src/modules/countries/dto/country-query.dto';
import { CountryRepository } from '../../../src/modules/countries/repositories/country.repository.interface';
import { mockCountryEntity } from '../../fixtures/country.fixtures';

jest.mock('node:fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

const mockGzip = Buffer.from('gzipped');
jest.mock('node:zlib', () => ({
  gzipSync: jest.fn(() => mockGzip),
}));

describe('CountryCacheService', () => {
  let service: CountryCacheService;
  let repo: jest.Mocked<CountryRepository>;

  const countries = [mockCountryEntity(), mockCountryEntity({ id: 45, name: 'Argentina', iso2: 'AR' })];

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryCacheService,
        {
          provide: 'CountryRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue(countries),
            findByTerm: jest.fn(),
            findByRegion: jest.fn(),
            findBySubregion: jest.fn(),
            findStateById: jest.fn(),
            findCityById: jest.fn(),
            search: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CountryCacheService);
    repo = module.get('CountryRepository');
  });

  describe('onModuleInit', () => {
    it('should call generateAll and populate the memory cache', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await service.onModuleInit();

      // findAll called 3 times (with all, with states, only countries)
      expect(repo.findAll).toHaveBeenCalledTimes(3);
      expect(repo.findAll).toHaveBeenCalledWith({ includeStates: true, includeCities: true });
      expect(repo.findAll).toHaveBeenCalledWith({ includeStates: true, includeCities: false });
      expect(repo.findAll).toHaveBeenCalledWith({ includeStates: false, includeCities: false });

      // Directory creation
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });

      // 6 combos → 6 file writes
      expect(fs.writeFileSync).toHaveBeenCalledTimes(6);
      expect(zlib.gzipSync).toHaveBeenCalledTimes(6);
    });

    it('should skip mkdir when cache dir already exists', async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      await service.onModuleInit();

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    beforeEach(async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      await service.onModuleInit();
    });

    it('should return cached gzip data for full/no-exclude', () => {
      const result = service.getAll();
      expect(result).not.toBeNull();
      expect(result!.gzip).toBeInstanceOf(Buffer);
      expect(result!.count).toBe(countries.length);
    });

    it('should return cached data for SIMPLE type', () => {
      const result = service.getAll(ResponseType.SIMPLE);
      expect(result).not.toBeNull();
      expect(result!.count).toBe(countries.length);
    });

    it('should return cached data for exclude STATES', () => {
      const result = service.getAll(undefined, ExcludeOption.STATES);
      expect(result).not.toBeNull();
      expect(result!.count).toBe(countries.length);
    });

    it('should return cached data for exclude CITIES', () => {
      const result = service.getAll(undefined, ExcludeOption.CITIES);
      expect(result).not.toBeNull();
      expect(result!.count).toBe(countries.length);
    });

    it('should return cached data for SIMPLE + exclude STATES', () => {
      const result = service.getAll(ResponseType.SIMPLE, ExcludeOption.STATES);
      expect(result).not.toBeNull();
      expect(result!.count).toBe(countries.length);
    });

    it('should return cached data for SIMPLE + exclude CITIES', () => {
      const result = service.getAll(ResponseType.SIMPLE, ExcludeOption.CITIES);
      expect(result).not.toBeNull();
      expect(result!.count).toBe(countries.length);
    });

    it('should return null for a key that was never cached', () => {
      // Access private memoryCache to delete one entry for testing
      const cache = (service as any).memoryCache as Map<string, unknown>;
      cache.clear();
      const result = service.getAll();
      expect(result).toBeNull();
    });
  });
});
