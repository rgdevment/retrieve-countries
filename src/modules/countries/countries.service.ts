import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CountryDto } from './dto/country.dto';
import { StateDto } from './dto/state.dto';
import { CountryRepository, CountryResult, StateResult } from './repositories/country.repository.interface';

@Injectable()
export class CountriesService {
  constructor(
    @Inject('CountryRepository')
    private readonly repo: CountryRepository,
  ) {}

  async getAllCountries(): Promise<CountryDto[]> {
    const countries = await this.repo.findAll();
    if (!countries.length) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return countries.map(c => this.toCountryDto(c));
  }

  async getCountryByName(name: string): Promise<CountryDto> {
    const country = await this.repo.findByName(name);
    if (!country) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return this.toCountryDto(country);
  }

  async getStateByName(name: string): Promise<StateDto> {
    const state = await this.repo.findStateByName(name);
    if (!state) throw new HttpException('No content', HttpStatus.NO_CONTENT);
    return this.toStateDto(state);
  }

  // ── Mapping ──────────────────────────────────────────────────

  private toCountryDto(data: CountryResult): CountryDto {
    const c = data.country;

    return {
      name: c.name,
      iso2: c.iso2 ?? '',
      iso3: c.iso3 ?? '',
      numeric_code: c.numeric_code ?? '',
      capital: c.capital ?? '',
      phonecode: c.phonecode ?? '',
      tld: c.tld ?? '',
      nationality: c.nationality ?? '',
      region: c.region ?? '',
      subregion: c.subregion ?? '',
      latitude: c.latitude ?? 0,
      longitude: c.longitude ?? 0,
      emoji: c.emoji ?? '',
      emojiU: c.emojiU ?? '',
      currency: {
        code: c.currency ?? '',
        name: c.currency_name ?? '',
        symbol: c.currency_symbol ?? '',
      },
      states: data.states.map(s => this.toStateDto(s)),
    };
  }

  private toStateDto(s: StateResult): StateDto {
    return {
      name: s.name,
      iso2: s.iso2 ?? '',
      type: s.type ?? '',
      country_code: s.country_code,
      latitude: s.latitude ?? 0,
      longitude: s.longitude ?? 0,
      cities: s.cities.map(ci => ({
        name: ci.name,
        state_code: ci.state_code,
        country_code: ci.country_code,
        latitude: ci.latitude,
        longitude: ci.longitude,
      })),
    };
  }
}
