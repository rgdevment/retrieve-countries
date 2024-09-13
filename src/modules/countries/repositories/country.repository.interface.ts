import { Country } from '../../../common/schemas/country.schema';
import { ExcludeOptions } from '../../../common/interfaces/exclude-options.interface';

export interface CountryRepository {
  findAll(options: ExcludeOptions): Promise<Country[]>;
  findByName(name: string, options: ExcludeOptions): Promise<Country | null>;
}
