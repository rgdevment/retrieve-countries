import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FlagDto {
  @ApiProperty({ description: 'Icon of the flag' })
  @Expose()
  readonly ico: string;

  @ApiProperty({ description: 'Alternative text for the flag' })
  @Expose()
  readonly alt: string;

  @ApiProperty({ description: 'PNG image of the flag' })
  @Expose()
  readonly png: string;

  @ApiProperty({ description: 'SVG image of the flag' })
  @Expose()
  readonly svg: string;
}
