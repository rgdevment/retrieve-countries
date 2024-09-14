import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({ description: 'Name of City' })
  @Expose()
  readonly name: string;

  @ApiProperty({ description: 'Country code for the city' })
  @Expose()
  readonly country_code: string;

  @ApiProperty({ description: 'State Code of the city' })
  @Expose()
  readonly state_code: string;

  @ApiProperty({ description: 'Latitude of the city' })
  @Expose()
  readonly latitude: number;

  @ApiProperty({ description: 'Longitude of the city' })
  @Expose()
  readonly longitude: number;
}
