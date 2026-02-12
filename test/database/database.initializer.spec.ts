import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseInitializer } from '../../src/database/database.initializer';
import { DATABASE_TOKEN } from '../../src/database/database.provider';

// Mock kysely sql tagged template
const mockExecute = jest.fn();
jest.mock('kysely', () => {
  const sqlTagged = () => ({ execute: mockExecute });
  sqlTagged.join = () => 'joined';
  sqlTagged.raw = () => ({ execute: mockExecute });
  return { sql: sqlTagged };
});

describe('DatabaseInitializer', () => {
  let initializer: DatabaseInitializer;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseInitializer,
        {
          provide: DATABASE_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    initializer = module.get(DatabaseInitializer);
  });

  describe('onModuleInit – validateSchema success', () => {
    it('should succeed when all required tables exist', async () => {
      const requiredTables = ['regions', 'subregions', 'countries', 'states', 'cities'];
      mockExecute
        .mockResolvedValueOnce({
          rows: requiredTables.map(name => ({ name })),
        })
        .mockResolvedValue(undefined); // for index DDLs

      await initializer.onModuleInit();

      // sql called once for validateSchema + 15 times for ensureIndexes
      expect(mockExecute).toHaveBeenCalledTimes(16);
    });
  });

  describe('onModuleInit – validateSchema missing tables', () => {
    it('should throw when tables are missing', async () => {
      mockExecute.mockResolvedValueOnce({
        rows: [{ name: 'regions' }, { name: 'subregions' }],
      });

      await expect(initializer.onModuleInit()).rejects.toThrow('Database is missing tables: countries, states, cities');
    });
  });

  describe('onModuleInit – ensureIndexes', () => {
    it('should create all 15 indexes', async () => {
      const requiredTables = ['regions', 'subregions', 'countries', 'states', 'cities'];
      mockExecute
        .mockResolvedValueOnce({
          rows: requiredTables.map(name => ({ name })),
        })
        .mockResolvedValue(undefined);

      await initializer.onModuleInit();

      // 1 for schema validation + 15 for indexes
      expect(mockExecute).toHaveBeenCalledTimes(16);
    });
  });
});
