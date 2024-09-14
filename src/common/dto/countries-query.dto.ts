import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ExcludeOptions } from '../interfaces/exclude-options.interface';
import { Transform } from 'class-transformer';

export class CountriesQueryDto implements ExcludeOptions {
  @ApiPropertyOptional({
    description: 'Exclude states in the response.',
    example: 'true',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  excludeStates?: boolean;

  @ApiPropertyOptional({
    description: 'Exclude cities in the response.',
    example: 'true',
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  excludeCities?: boolean;
}
