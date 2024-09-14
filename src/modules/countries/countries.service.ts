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

    if (!countries.length) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return plainToInstance(CountryDto, countries, { excludeExtraneousValues: true });
  }

  async getCountryByName(name: string, options: ExcludeOptions): Promise<CountryDto> {
    const country = await this.countryRepository.findByField('name', name, options);

    if (!country) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return plainToInstance(CountryDto, country, { excludeExtraneousValues: true });
  }

  async getCountryByCapital(capital: string, options: ExcludeOptions): Promise<CountryDto> {
    const country = await this.countryRepository.findByField('capital', capital, options);

    if (!country) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return plainToInstance(CountryDto, country, { excludeExtraneousValues: true });
  }
}
