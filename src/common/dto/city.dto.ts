import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({ description: 'Name of the city' })
  readonly name!: string;

  @ApiProperty({ description: 'Country code for the city' })
  readonly country_code!: string;

  @ApiProperty({ description: 'State code of the city' })
  readonly state_code!: string;

  @ApiProperty({ description: 'Latitude of the city' })
  readonly latitude!: number;

  @ApiProperty({ description: 'Longitude of the city' })
  readonly longitude!: number;
}
