import { ApiProperty } from '@nestjs/swagger';
import { CityDto } from './city.dto';
import { CurrencyDto } from './currency.dto';
import { FlagDto } from './flag.dto';
import { StateDto } from './state.dto';

export class CountryDto {
  @ApiProperty({ description: 'Name of the country' })
  readonly name!: string;

  @ApiProperty({ description: 'Capital city of the country' })
  readonly capital!: string;

  @ApiProperty({ description: 'Country code' })
  readonly code!: string;

  @ApiProperty({ description: 'ISO3 code of the country' })
  readonly iso3!: string;

  @ApiProperty({ description: 'Phone code of the country' })
  readonly phone_code!: string;

  @ApiProperty({ description: 'Region of the country' })
  readonly region!: string;

  @ApiProperty({ description: 'Subregion of the country' })
  readonly subregion!: string;

  @ApiProperty({ description: 'Currency details', type: CurrencyDto })
  readonly currency!: CurrencyDto;

  @ApiProperty({ description: 'Flag details', type: FlagDto })
  readonly flags!: FlagDto;

  @ApiProperty({ description: 'List of states', type: [StateDto], required: false })
  readonly states?: StateDto[];

  @ApiProperty({ description: 'List of cities', type: [CityDto], required: false })
  readonly cities?: CityDto[];

  @ApiProperty({ description: 'Latitude of the country' })
  readonly latitude!: number;

  @ApiProperty({ description: 'Longitude of the country' })
  readonly longitude!: number;

  @ApiProperty({ description: 'Top-level domain' })
  readonly tld!: string;
}
