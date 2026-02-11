import { ApiProperty } from '@nestjs/swagger';
import { CurrencyDto } from './currency.dto';
import { StateDto } from './state.dto';

export class CountryDto {
  @ApiProperty({ example: 'Chile' })
  readonly name!: string;

  @ApiProperty({ example: 'CL' })
  readonly iso2!: string;

  @ApiProperty({ example: 'CHL' })
  readonly iso3!: string;

  @ApiProperty({ example: '152' })
  readonly numeric_code!: string;

  @ApiProperty({ example: 'Santiago' })
  readonly capital!: string;

  @ApiProperty({ example: '+56' })
  readonly phonecode!: string;

  @ApiProperty({ example: '.cl' })
  readonly tld!: string;

  @ApiProperty({ example: 'Chilean' })
  readonly nationality!: string;

  @ApiProperty({ example: 'Americas' })
  readonly region!: string;

  @ApiProperty({ example: 'South America' })
  readonly subregion!: string;

  @ApiProperty({ example: -35.6751 })
  readonly latitude!: number;

  @ApiProperty({ example: -71.543 })
  readonly longitude!: number;

  @ApiProperty({ example: '🇨🇱' })
  readonly emoji!: string;

  @ApiProperty({ example: 'U+1F1E8 U+1F1F1' })
  readonly emojiU!: string;

  @ApiProperty({ type: CurrencyDto })
  readonly currency!: CurrencyDto;

  @ApiProperty({ type: [StateDto] })
  readonly states!: StateDto[];
}
