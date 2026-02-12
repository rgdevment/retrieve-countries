import { ApiProperty } from '@nestjs/swagger';

export class CitySimpleDto {
  @ApiProperty({ example: 21553, description: 'Unique identifier' })
  readonly id!: number;

  @ApiProperty({ example: 'Calama' })
  readonly name!: string;
}
