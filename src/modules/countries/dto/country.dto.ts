import { ApiProperty } from '@nestjs/swagger';
import { CurrencyDto } from './currency.dto';
import { RegionDto } from './region.dto';
import { StateDto } from './state.dto';
import { SubregionDto } from './subregion.dto';
import { TimezoneDto } from './timezone.dto';

export class CountryDto {
  @ApiProperty({ example: 44, description: 'Unique identifier' })
  readonly id!: number;

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

  @ApiProperty({ example: 'Chile' })
  readonly native!: string;

  @ApiProperty({ example: 'Chilean' })
  readonly nationality!: string;

  @ApiProperty({ type: RegionDto })
  readonly region!: RegionDto;

  @ApiProperty({ type: SubregionDto })
  readonly subregion!: SubregionDto;

  @ApiProperty({ example: -35.6751 })
  readonly latitude!: number;

  @ApiProperty({ example: -71.543 })
  readonly longitude!: number;

  @ApiProperty({ example: '🇨🇱' })
  readonly emoji!: string;

  @ApiProperty({ example: 'U+1F1E8 U+1F1F1' })
  readonly emojiU!: string;

  @ApiProperty({ type: [TimezoneDto] })
  readonly timezones!: TimezoneDto[];

  @ApiProperty({ example: { es: 'Chile' }, nullable: true })
  readonly translations!: Record<string, string> | null;

  @ApiProperty({ example: 'Q298' })
  readonly wikiDataId!: string;

  @ApiProperty({ type: CurrencyDto })
  readonly currency!: CurrencyDto;

  @ApiProperty({ type: [StateDto] })
  readonly states!: StateDto[];
}
