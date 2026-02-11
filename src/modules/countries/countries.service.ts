import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryEntity } from './entities';
import { CountryRepository } from './repositories/country.repository.interface';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('CountryRepository')
    private readonly repo: CountryRepository,
  ) {}

  async getAllCountries(): Promise<CountryEntity[]> {
    const countries = await this.repo.findAll();
    if (!countries.length) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return countries;
  }

  async getCountryByName(name: string): Promise<CountryEntity> {
    const country = await this.repo.findByName(name);
    if (!country) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return country;
  }

  async getCountryByStateName(name: string): Promise<CountryEntity> {
    const country = await this.repo.findCountryByStateName(name);
    if (!country) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return country;
  }
}
