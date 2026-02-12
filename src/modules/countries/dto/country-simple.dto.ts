import { ApiProperty } from '@nestjs/swagger';
import { StateSimpleDto } from './state-simple.dto';

/**
 * Lightweight country representation for dropdown/select use cases.
 * Returned when `?type=simple` is specified.
 * States and cities are still included (as simple objects) unless explicitly excluded.
 */
export class CountrySimpleDto {
  @ApiProperty({ example: 44, description: 'Unique identifier' })
  readonly id!: number;

  @ApiProperty({ example: 'Chile', description: 'Country name' })
  readonly name!: string;

  @ApiProperty({ example: 'CL', description: 'ISO 3166-1 alpha-2 code' })
  readonly iso2!: string;

  @ApiProperty({ example: '🇨🇱', description: 'Flag emoji' })
  readonly emoji!: string;

  @ApiProperty({ type: [StateSimpleDto], description: 'States in simple format' })
  readonly states!: StateSimpleDto[];
}
