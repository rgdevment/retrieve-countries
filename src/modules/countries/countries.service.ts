import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryRepository } from './repositories/country.repository.interface';
import { CountryDto } from '../../common/dto/country.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CountriesService {
  constructor(@Inject('CountryRepository') private readonly countryRepository: CountryRepository) {}

  async getAllCountries(includeStates: boolean): Promise<CountryDto[]> {
    const countries = await this.countryRepository.findAll({ includeStates });

    if (!countries.length) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return plainToInstance(CountryDto, countries, { excludeExtraneousValues: true });
  }
}
