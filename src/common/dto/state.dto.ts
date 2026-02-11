import { ApiProperty } from '@nestjs/swagger';

export class StateDto {
  @ApiProperty({ description: 'Name of the state' })
  readonly name!: string;

  @ApiProperty({ description: 'Code of the state' })
  readonly code!: string;

  @ApiProperty({ description: 'Country code for the state' })
  readonly country_code!: string;

  @ApiProperty({ description: 'Latitude of the state' })
  readonly latitude!: number;

  @ApiProperty({ description: 'Longitude of the state' })
  readonly longitude!: number;
}
