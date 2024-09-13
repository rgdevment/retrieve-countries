import { Country } from '../../../common/schemas/country.schema';
import { IncludeOptions } from '../../../common/interfaces/include-options.interface';

export interface CountryRepository {
  findAll(options: IncludeOptions): Promise<Country[]>;
}
