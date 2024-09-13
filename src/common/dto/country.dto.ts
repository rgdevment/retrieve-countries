import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { StateDto } from './state.dto';
import { CurrencyDto } from './currency.dto';
import { FlagDto } from './flag.dto';

export class CountryDto {
  @ApiProperty({ description: 'Name of the country' })
  @Expose()
  readonly name: string;

  @ApiProperty({ description: 'Capital city of the country' })
  @Expose()
  readonly capital: string;

  @ApiProperty({ description: 'Country code' })
  @Expose()
  readonly code: string;

  @ApiProperty({ description: 'ISO3 code of the country' })
  @Expose()
  readonly iso3: string;

  @ApiProperty({ description: 'Phone code of the country' })
  @Expose()
  readonly phone_code: string;

  @ApiProperty({ description: 'Region of the country' })
  @Expose()
  readonly region: string;

  @ApiProperty({ description: 'Subregion of the country' })
  @Expose()
  readonly subregion: string;

  @ApiProperty({
    description: 'Currency details',
    type: CurrencyDto,
  })
  @Expose()
  @Type(() => CurrencyDto)
  readonly currency: CurrencyDto;

  @ApiProperty({
    description: 'Flag details',
    type: FlagDto,
  })
  @Expose()
  @Type(() => FlagDto)
  readonly flags: FlagDto;

  @ApiProperty({
    description: 'List of states in the country',
    type: [StateDto],
    required: false,
  })
  @Expose()
  @Type(() => StateDto)
  readonly states?: StateDto[];

  @ApiProperty({ description: 'Latitude of the country' })
  @Expose()
  readonly latitude: number;

  @ApiProperty({ description: 'Longitude of the country' })
  @Expose()
  readonly longitude: number;

  @ApiProperty({ description: 'Top-level domain' })
  @Expose()
  readonly tld: string;
}
