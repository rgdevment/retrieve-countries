import { ApiProperty } from '@nestjs/swagger';
import { CitySimpleDto } from './city-simple.dto';

export class StateSimpleDto {
  @ApiProperty({ example: 2113, description: 'Unique identifier' })
  readonly id!: number;

  @ApiProperty({ example: 'Antofagasta' })
  readonly name!: string;

  @ApiProperty({ example: 'AN' })
  readonly iso2!: string;

  @ApiProperty({ type: [CitySimpleDto] })
  readonly cities!: CitySimpleDto[];
}
