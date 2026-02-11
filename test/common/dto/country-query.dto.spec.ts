import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CountryQueryDto } from '../../../src/common/dto/country-query.dto';

describe('CountryQueryDto', () => {
  it('should transform string "true" to boolean true', async () => {
    const dto = plainToInstance(CountryQueryDto, {
      excludeStates: 'true',
      excludeCities: 'false',
    });

    expect(dto.excludeStates).toBe(true);
    expect(dto.excludeCities).toBe(false);

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should allow missing values', async () => {
    const dto = plainToInstance(CountryQueryDto, {});

    expect(dto.excludeStates).toBeUndefined();
    expect(dto.excludeCities).toBeUndefined();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
