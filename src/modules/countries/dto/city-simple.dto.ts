import { ApiProperty } from '@nestjs/swagger';

/**
 * Lightweight city representation returned when `?type=simple`.
 */
export class CitySimpleDto {
  @ApiProperty({ example: 21553, description: 'Unique identifier' })
  readonly id!: number;

  @ApiProperty({ example: 'Calama' })
  readonly name!: string;
}
