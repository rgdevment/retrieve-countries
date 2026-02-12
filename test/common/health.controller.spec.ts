import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../../src/common/controller/health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('ping', () => {
    it('should return health status', async () => {
      const result = await controller.ping();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });

    it('should return valid ISO timestamp', async () => {
      const result = await controller.ping();
      const timestamp = new Date(result.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(result.timestamp);
    });

    it('should return fresh timestamp on each call', async () => {
      const result1 = await controller.ping();

      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));

      const result2 = await controller.ping();

      expect(result1.timestamp).not.toBe(result2.timestamp);
    });
  });
});
