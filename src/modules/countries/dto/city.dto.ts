import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({ example: 'Antofagasta' })
  readonly name!: string;

  @ApiProperty({ example: 'AN' })
  readonly state_code!: string;

  @ApiProperty({ example: 'CL' })
  readonly country_code!: string;

  @ApiProperty({ example: -22.46 })
  readonly latitude!: number;

  @ApiProperty({ example: -68.93 })
  readonly longitude!: number;

  @ApiProperty({ example: 'Q180694' })
  readonly wikiDataId!: string;
}
