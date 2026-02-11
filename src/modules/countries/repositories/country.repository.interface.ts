import { CountryEntity } from '../entities';

export interface CountryRepository {
  findAll(): Promise<CountryEntity[]>;
  findByName(name: string): Promise<CountryEntity | null>;
  findCountryByStateName(name: string): Promise<CountryEntity | null>;
}
