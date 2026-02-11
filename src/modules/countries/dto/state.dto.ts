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

  @ApiProperty({ example: '', nullable: true })
  readonly fips_code!: string;

  @ApiProperty({ example: null, nullable: true })
  readonly level!: number | null;

  @ApiProperty({ example: null, nullable: true })
  readonly parent_id!: number | null;

  @ApiProperty({ example: 'Antofagasta' })
  readonly native!: string;

  @ApiProperty({ example: -23.65 })
  readonly latitude!: number;

  @ApiProperty({ example: -70.4 })
  readonly longitude!: number;

  @ApiProperty({ example: 'Q2106' })
  readonly wikiDataId!: string;

  @ApiProperty({ type: [CityDto] })
  readonly cities!: CityDto[];
}
