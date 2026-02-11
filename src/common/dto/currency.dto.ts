import { ApiProperty } from '@nestjs/swagger';

export class CurrencyDto {
  @ApiProperty({ description: 'Currency symbol' })
  readonly symbol!: string;

  @ApiProperty({ description: 'Currency code' })
  readonly code!: string;

  @ApiProperty({ description: 'Currency name' })
  readonly name!: string;
}
