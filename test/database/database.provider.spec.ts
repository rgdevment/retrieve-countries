import { ConfigService } from '@nestjs/config';
import { DATABASE_TOKEN, DatabaseProvider } from '../../src/database/database.provider';

jest.mock('better-sqlite3', () => {
  const pragmaFn = jest.fn();
  return jest.fn(() => ({ pragma: pragmaFn }));
});

describe('DatabaseProvider', () => {
  it('should have the correct provide token', () => {
    expect((DatabaseProvider as any).provide).toBe(DATABASE_TOKEN);
    expect(DATABASE_TOKEN).toBe('DATABASE_CONNECTION');
  });

  it('should inject ConfigService', () => {
    expect((DatabaseProvider as any).inject).toEqual([ConfigService]);
  });

  it('should create a Kysely instance from config values', () => {
    const mockConfig = new Map<string, string>([
      ['DATABASE_PATH', ':memory:'],
      ['SQLITE_JOURNAL_MODE', 'WAL'],
      ['SQLITE_BUSY_TIMEOUT', '5000'],
      ['SQLITE_SYNCHRONOUS', 'NORMAL'],
      ['SQLITE_CACHE_SIZE', '-20000'],
    ]);

    const configService = {
      getOrThrow: jest.fn((key: string) => {
        const val = mockConfig.get(key);
        if (val === undefined) throw new Error('Missing ' + key);
        return val;
      }),
    } as unknown as ConfigService;

    const factory = (DatabaseProvider as any).useFactory;
    const db = factory(configService);

    expect(db).toBeDefined();
    expect(configService.getOrThrow).toHaveBeenCalledWith('DATABASE_PATH');
    expect(configService.getOrThrow).toHaveBeenCalledWith('SQLITE_JOURNAL_MODE');
    expect(configService.getOrThrow).toHaveBeenCalledWith('SQLITE_BUSY_TIMEOUT');
    expect(configService.getOrThrow).toHaveBeenCalledWith('SQLITE_SYNCHRONOUS');
    expect(configService.getOrThrow).toHaveBeenCalledWith('SQLITE_CACHE_SIZE');
  });
});
