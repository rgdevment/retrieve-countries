import { Country } from '../../../common/schemas/country.schema';
import { ExcludeOptions } from '../../../common/interfaces/exclude-options.interface';

export interface CountryRepository {
  findAll(options: ExcludeOptions): Promise<Country[]>;
  findOneBy(field: string, value: string, options: ExcludeOptions): Promise<Country | null>;
  findAllBy(field: string, value: string, options: ExcludeOptions): Promise<Country[]>;
}
