import { Test, TestingModule } from '@nestjs/testing';
import { EnsureIndexesCommand } from '../../../src/command/ensure-index/ensure-index.command';
import { IndexService } from '../../../src/configuration/index/index.service';

describe('EnsureIndexesCommand', () => {
  let command: EnsureIndexesCommand;
  let indexService: IndexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnsureIndexesCommand,
        {
          provide: IndexService,
          useValue: {
            ensureTextIndex: jest.fn(),
          },
        },
      ],
    }).compile();

    command = module.get<EnsureIndexesCommand>(EnsureIndexesCommand);
    indexService = module.get<IndexService>(IndexService);
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  it('should run ensureTextIndex with correct parameters', async () => {
    await command.run();
    expect(indexService.ensureTextIndex).toHaveBeenCalledWith(['name', 'capital'], 'countries_text');
  });

  it('should log success message', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    await command.run();
    expect(consoleLogSpy).toHaveBeenCalledWith('Indexes ensured successfully.');
    consoleLogSpy.mockRestore();
  });

  it('should handle errors', async () => {
    jest.spyOn(indexService, 'ensureTextIndex').mockRejectedValue(new Error('Test error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    await command.run();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error ensuring indexes:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
});
