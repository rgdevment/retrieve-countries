export function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function bestMatch<T>(query: string, items: T[], key: (item: T) => string): T | null {
  const q = normalize(query);
  let startsWithMatch: T | null = null;
  let includesMatch: T | null = null;

  for (const item of items) {
    const k = normalize(key(item));
    if (k === q) return item;
    if (!startsWithMatch && k.startsWith(q)) startsWithMatch = item;
    if (!includesMatch && k.includes(q)) includesMatch = item;
  }

  return startsWithMatch ?? includesMatch ?? null;
}
