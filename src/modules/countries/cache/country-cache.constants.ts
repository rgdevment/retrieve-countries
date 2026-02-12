import { join } from 'node:path';
import { ExcludeOption, ResponseType } from '../dto/country-query.dto';

export const CACHE_DIR = join(process.cwd(), 'data', 'cache');

export function getCacheFileName(type?: ResponseType, exclude?: ExcludeOption): string {
  const typePart = type === ResponseType.SIMPLE ? 'simple' : 'full';

  let excludePart = '';
  if (exclude === ExcludeOption.STATES) excludePart = '-exclude-states';
  else if (exclude === ExcludeOption.CITIES) excludePart = '-exclude-cities';

  return `countries-${typePart}${excludePart}.json.gz`;
}

export const ALL_CACHE_COMBOS: { type?: ResponseType; exclude?: ExcludeOption }[] = [
  { type: undefined, exclude: undefined },
  { type: undefined, exclude: ExcludeOption.CITIES },
  { type: undefined, exclude: ExcludeOption.STATES },
  { type: ResponseType.SIMPLE, exclude: undefined },
  { type: ResponseType.SIMPLE, exclude: ExcludeOption.CITIES },
  { type: ResponseType.SIMPLE, exclude: ExcludeOption.STATES },
];
