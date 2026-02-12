import { ExcludeOption } from '../dto/country-query.dto';
import {
  CityEntity,
  CitySimpleEntity,
  CountryEntity,
  CountrySimpleEntity,
  StateEntity,
  StateSimpleEntity,
} from '../entities';
import { HierarchyOptions } from '../repositories/country.repository.interface';

export function parseExclude(exclude?: ExcludeOption): HierarchyOptions {
  switch (exclude) {
    case ExcludeOption.STATES:
      return { includeStates: false, includeCities: false };
    case ExcludeOption.CITIES:
      return { includeStates: true, includeCities: false };
    default:
      return { includeStates: true, includeCities: true };
  }
}

export function toSimpleCountry(country: CountryEntity): CountrySimpleEntity {
  return {
    id: country.id,
    name: country.name,
    iso2: country.iso2,
    emoji: country.emoji,
    states: (country.states ?? []).map(toSimpleState),
  };
}

export function toSimpleState(state: StateEntity): StateSimpleEntity {
  return {
    id: state.id,
    name: state.name,
    iso2: state.iso2,
    cities: (state.cities ?? []).map(toSimpleCity),
  };
}

export function toSimpleCity(city: CityEntity): CitySimpleEntity {
  return {
    id: city.id,
    name: city.name,
  };
}
