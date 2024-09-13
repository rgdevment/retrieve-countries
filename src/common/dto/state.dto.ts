import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StateDto {
  @ApiProperty({ description: 'Name of the state' })
  @Expose()
  readonly name: string;

  @ApiProperty({ description: 'Code of the state' })
  @Expose()
  readonly code: string;

  @ApiProperty({ description: 'Country code for the state' })
  @Expose()
  readonly country_code: string;

  @ApiProperty({ description: 'Latitude of the state' })
  @Expose()
  readonly latitude: number;

  @ApiProperty({ description: 'Longitude of the state' })
  @Expose()
  readonly longitude: number;
}
