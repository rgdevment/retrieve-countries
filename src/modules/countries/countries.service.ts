import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryRepository } from './repositories/country.repository.interface';
import { CountryDto } from '../../common/dto/country.dto';
import { plainToInstance } from 'class-transformer';
import { ExcludeOptions } from '../../common/interfaces/exclude-options.interface';

@Injectable()
export class CountriesService {
  constructor(@Inject('CountryRepository') private readonly countryRepository: CountryRepository) {}

  async getAllCountries(options: ExcludeOptions): Promise<CountryDto[]> {
    const countries = await this.countryRepository.findAll(options);
    return this.handleArrayResult(countries);
  }

  async getCountryByName(name: string, options: ExcludeOptions): Promise<CountryDto> {
    const country = await this.countryRepository.findOneBy('name', name, options);
    return this.handleSingleResult(country);
  }

  async getCountryByCapital(capital: string, options: ExcludeOptions): Promise<CountryDto> {
    const country = await this.countryRepository.findOneBy('capital', capital, options);
    return this.handleSingleResult(country);
  }

  async getCountryByRegion(region: string, options: ExcludeOptions): Promise<CountryDto[]> {
    const countries = await this.countryRepository.findAllBy('region', region, options);
    return this.handleArrayResult(countries);
  }

  async getCountryBySubregion(subregion: string, options: ExcludeOptions): Promise<CountryDto[]> {
    const countries = await this.countryRepository.findAllBy('subregion', subregion, options);
    return this.handleArrayResult(countries);
  }

  private handleSingleResult<T>(result: T): CountryDto {
    if (!result) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    return plainToInstance(CountryDto, result, { excludeExtraneousValues: true });
  }

  private handleArrayResult<T>(results: T[]): CountryDto[] {
    if (!results.length) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    return plainToInstance(CountryDto, results, { excludeExtraneousValues: true });
  }
}
