import { ApiProperty } from '@nestjs/swagger';

export class TimezoneDto {
  @ApiProperty({ example: 'America/Santiago' })
  readonly zoneName!: string;

  @ApiProperty({ example: -14400 })
  readonly gmtOffset!: number;

  @ApiProperty({ example: 'UTC-04:00' })
  readonly gmtOffsetName!: string;

  @ApiProperty({ example: 'CLT' })
  readonly abbreviation!: string;

  @ApiProperty({ example: 'Chile Standard Time' })
  readonly tzName!: string;
}
