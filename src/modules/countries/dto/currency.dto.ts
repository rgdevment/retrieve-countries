import { ApiProperty } from '@nestjs/swagger';

export class CurrencyDto {
  @ApiProperty({ example: 'CLP' })
  readonly code!: string;

  @ApiProperty({ example: '$' })
  readonly symbol!: string;

  @ApiProperty({ example: 'Chilean Peso' })
  readonly name!: string;
}
