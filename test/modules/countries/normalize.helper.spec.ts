import { bestMatch, normalize } from '../../../src/modules/countries/helpers/normalize';

describe('normalize', () => {
  it('should remove accents from text', () => {
    expect(normalize('José')).toBe('jose');
    expect(normalize('Müller')).toBe('muller');
    expect(normalize('São Paulo')).toBe('sao paulo');
  });

  it('should convert to lowercase', () => {
    expect(normalize('CHILE')).toBe('chile');
    expect(normalize('Buenos Aires')).toBe('buenos aires');
  });

  it('should handle combined accents and uppercase', () => {
    expect(normalize('BOGOTÁ')).toBe('bogota');
    expect(normalize('Montréal')).toBe('montreal');
  });

  it('should handle strings without accents', () => {
    expect(normalize('London')).toBe('london');
    expect(normalize('USA')).toBe('usa');
  });

  it('should handle empty strings', () => {
    expect(normalize('')).toBe('');
  });
});

describe('bestMatch', () => {
  interface Item {
    id: number;
    name: string;
  }

  const items: Item[] = [
    { id: 1, name: 'Santiago' },
    { id: 2, name: 'Santiago del Estero' },
    { id: 3, name: 'San Pedro' },
    { id: 4, name: 'Buenos Aires' },
    { id: 5, name: 'São Paulo' },
  ];

  it('should return exact match', () => {
    const result = bestMatch('Santiago', items, (item) => item.name);
    expect(result).toEqual({ id: 1, name: 'Santiago' });
  });

  it('should return exact match ignoring accents and case', () => {
    const result = bestMatch('são paulo', items, (item) => item.name);
    expect(result).toEqual({ id: 5, name: 'São Paulo' });
  });

  it('should return starts-with match when no exact match', () => {
    const result = bestMatch('San', items, (item) => item.name);
    expect(result?.name).toMatch(/^San/);
  });

  it('should return includes match when no starts-with match', () => {
    const result = bestMatch('aires', items, (item) => item.name);
    expect(result).toEqual({ id: 4, name: 'Buenos Aires' });
  });

  it('should return null when no match found', () => {
    const result = bestMatch('London', items, (item) => item.name);
    expect(result).toBeNull();
  });

  it('should handle empty items array', () => {
    const result = bestMatch<Item>('test', [], (item) => item.name);
    expect(result).toBeNull();
  });

  it('should prefer exact match over starts-with', () => {
    const testItems: Item[] = [
      { id: 1, name: 'San' },
      { id: 2, name: 'Santiago' },
    ];
    const result = bestMatch('San', testItems, (item) => item.name);
    expect(result).toEqual({ id: 1, name: 'San' });
  });

  it('should prefer starts-with over includes', () => {
    const result = bestMatch('sant', items, (item) => item.name);
    expect(result?.name).toBe('Santiago');
  });
});
