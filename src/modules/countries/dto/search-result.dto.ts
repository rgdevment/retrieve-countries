import { ApiProperty } from '@nestjs/swagger';

export class CountrySearchItemDto {
  @ApiProperty({ example: 44 })
  readonly id!: number;

  @ApiProperty({ example: 'Chile' })
  readonly name!: string;

  @ApiProperty({ example: 'CL' })
  readonly iso2!: string;

  @ApiProperty({ example: '🇨🇱' })
  readonly emoji!: string;
}

export class StateSearchItemDto {
  @ApiProperty({ example: 2113 })
  readonly id!: number;

  @ApiProperty({ example: 'Antofagasta' })
  readonly name!: string;

  @ApiProperty({ example: 'AN' })
  readonly iso2!: string;

  @ApiProperty({ example: 'Chile' })
  readonly country_name!: string;

  @ApiProperty({ example: 'CL' })
  readonly country_iso2!: string;
}

export class CitySearchItemDto {
  @ApiProperty({ example: 21553 })
  readonly id!: number;

  @ApiProperty({ example: 'Calama' })
  readonly name!: string;

  @ApiProperty({ example: 'Antofagasta' })
  readonly state_name!: string;

  @ApiProperty({ example: 'Chile' })
  readonly country_name!: string;

  @ApiProperty({ example: 'CL' })
  readonly country_iso2!: string;
}

export class SearchResultDto {
  @ApiProperty({ type: [CountrySearchItemDto], description: 'Matching countries' })
  readonly countries!: CountrySearchItemDto[];

  @ApiProperty({ type: [StateSearchItemDto], description: 'Matching states/regions' })
  readonly states!: StateSearchItemDto[];

  @ApiProperty({ type: [CitySearchItemDto], description: 'Matching cities' })
  readonly cities!: CitySearchItemDto[];
}
