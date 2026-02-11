import { ApiProperty } from '@nestjs/swagger';

export class FlagDto {
  @ApiProperty({ description: 'Icon of the flag' })
  readonly ico!: string;

  @ApiProperty({ description: 'Alternative text for the flag' })
  readonly alt!: string;

  @ApiProperty({ description: 'PNG image of the flag' })
  readonly png!: string;

  @ApiProperty({ description: 'SVG image of the flag' })
  readonly svg!: string;
}
