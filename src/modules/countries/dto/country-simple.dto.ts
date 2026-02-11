import { ApiProperty } from '@nestjs/swagger';

/**
 * Lightweight country representation for dropdown/select use cases.
 * Returned when `?type=simple` is specified.
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
}
