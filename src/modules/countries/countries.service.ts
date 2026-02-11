import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryDto } from '../../common/dto/country.dto';
import { ExcludeOptions } from '../../common/interfaces/exclude-options.interface';
import { CountryRepository, CountryWithRelations } from './repositories/country.repository.interface';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('CountryRepository')
    private readonly countryRepository: CountryRepository,
  ) {}

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

  private handleSingleResult(result: CountryWithRelations | null): CountryDto {
    if (!result) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    return this.toDto(result);
  }

  private handleArrayResult(results: CountryWithRelations[]): CountryDto[] {
    if (!results.length) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    return results.map(r => this.toDto(r));
  }

  private toDto(row: CountryWithRelations): CountryDto {
    return {
      name: row.name,
      capital: row.capital ?? '',
      code: row.code,
      iso3: row.iso3 ?? '',
      phone_code: row.phone_code ?? '',
      region: row.region ?? '',
      subregion: row.subregion ?? '',
      latitude: row.latitude ?? 0,
      longitude: row.longitude ?? 0,
      tld: row.tld ?? '',
      currency: {
        code: row.currency_code ?? '',
        symbol: row.currency_symbol ?? '',
        name: row.currency_name ?? '',
      },
      flags: {
        ico: row.flag_ico ?? '',
        alt: row.flag_alt ?? '',
        png: row.flag_png ?? '',
        svg: row.flag_svg ?? '',
      },
      states: row.states?.map(s => ({
        name: s.name,
        code: s.code ?? '',
        country_code: s.country_code,
        latitude: s.latitude ?? 0,
        longitude: s.longitude ?? 0,
      })),
      cities: row.cities?.map(c => ({
        name: c.name,
        state_code: c.state_code ?? '',
        country_code: c.country_code,
        latitude: c.latitude ?? 0,
        longitude: c.longitude ?? 0,
      })),
    };
  }
}
