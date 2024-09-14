import { OmitType } from '@nestjs/swagger';
import { CountryQueryDto } from './country-query.dto';

export class CountriesQueryDto extends OmitType(CountryQueryDto, ['excludeCities'] as const) {}
