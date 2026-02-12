import {
  CityEntity,
  CountryEntity,
  StateEntity,
} from '../../src/modules/countries/entities';

export const MOCK_CITY: CityEntity = {
  id: 21553,
  name: 'Calama',
  state_code: 'AN',
  country_code: 'CL',
  latitude: -22.46,
  longitude: -68.93,
  wikiDataId: 'Q53747',
};

export const MOCK_STATE: StateEntity = {
  id: 2113,
  name: 'Antofagasta',
  iso2: 'AN',
  type: 'region',
  country_code: 'CL',
  fips_code: '',
  level: null,
  parent_id: null,
  native: '',
  latitude: -23.65,
  longitude: -70.4,
  wikiDataId: '',
  cities: [MOCK_CITY],
};

export const MOCK_STATE_NO_CITIES: StateEntity = {
  ...MOCK_STATE,
  cities: [],
};

export function mockCountryEntity(
  overrides?: Partial<CountryEntity>,
): CountryEntity {
  return {
    id: 44,
    name: 'Chile',
    iso2: 'CL',
    iso3: 'CHL',
    numeric_code: '152',
    capital: 'Santiago',
    phonecode: '56',
    tld: '.cl',
    native: 'Chile',
    nationality: 'Chilean',
    region: { name: 'Americas', translations: null, wikiDataId: '' },
    subregion: { name: 'South America', translations: null, wikiDataId: '' },
    latitude: -35.6751,
    longitude: -71.543,
    emoji: 'CL_EMOJI',
    emojiU: 'U+1F1E8 U+1F1F1',
    timezones: [],
    translations: null,
    wikiDataId: '',
    currency: { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
    states: [MOCK_STATE],
    ...overrides,
  };
}
