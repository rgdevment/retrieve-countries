import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CurrencyDto {
  @ApiProperty({ description: 'Currency symbol' })
  @Expose()
  readonly symbol: string;

  @ApiProperty({ description: 'Currency code' })
  @Expose()
  readonly code: string;

  @ApiProperty({ description: 'Currency name' })
  @Expose()
  readonly name: string;
}
