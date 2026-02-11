import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryDto } from './dto/country.dto';
import { StateDto } from './dto/state.dto';
import { CountryRepository } from './repositories/country.repository.interface';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('CountryRepository')
    private readonly repo: CountryRepository,
  ) {}

  async getAllCountries(): Promise<CountryDto[]> {
    const countries = await this.repo.findAll();
    if (!countries.length) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return countries;
  }

  async getCountryByName(name: string): Promise<CountryDto> {
    const country = await this.repo.findByName(name);
    if (!country) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return country;
  }

  async getStateByName(name: string): Promise<StateDto> {
    const state = await this.repo.findStateByName(name);
    if (!state) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return state;
  }
}
