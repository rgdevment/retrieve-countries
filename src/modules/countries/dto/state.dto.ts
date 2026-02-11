import { ApiProperty } from '@nestjs/swagger';
import { CityDto } from './city.dto';

export class StateDto {
  @ApiProperty({ example: 'Antofagasta' })
  readonly name!: string;

  @ApiProperty({ example: 'AN' })
  readonly iso2!: string;

  @ApiProperty({ example: 'region', nullable: true })
  readonly type!: string;

  @ApiProperty({ example: 'CL' })
  readonly country_code!: string;

  @ApiProperty({ example: -23.65 })
  readonly latitude!: number;

  @ApiProperty({ example: -70.4 })
  readonly longitude!: number;

  @ApiProperty({ type: [CityDto] })
  readonly cities!: CityDto[];
}
