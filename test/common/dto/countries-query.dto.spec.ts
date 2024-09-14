import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CountriesQueryDto } from '../../../src/common/dto/countries-query.dto';

describe('CountriesQueryDto', () => {
  it('should transform string values to booleans', async () => {
    const rawQuery = { excludeStates: 'true', excludeCities: 'false' };
    const dto = plainToInstance(CountriesQueryDto, rawQuery);

    expect(dto.excludeStates).toBe(true);
    expect(dto.excludeCities).toBe(false);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should handle missing values gracefully', async () => {
    const rawQuery = {};
    const dto = plainToInstance(CountriesQueryDto, rawQuery);

    expect(dto.excludeStates).toBeUndefined();
    expect(dto.excludeCities).toBeUndefined();

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
