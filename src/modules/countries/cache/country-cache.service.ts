import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { ExcludeOption, ResponseType } from '../dto/country-query.dto';
import { CountryEntity } from '../entities';
import { parseExclude, toSimpleCountry } from '../helpers/simplify';
import { CountryRepository, HierarchyOptions } from '../repositories/country.repository.interface';
import { ALL_CACHE_COMBOS, CACHE_DIR, getCacheFileName } from './country-cache.constants';

@Injectable()
export class CountryCacheService implements OnModuleInit {
  private readonly logger = new Logger(CountryCacheService.name);
  private readonly memoryCache = new Map<string, { gzip: Buffer; count: number }>();

  constructor(
    @Inject('CountryRepository')
    private readonly repo: CountryRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.generateAll();
  }

  getAll(type?: ResponseType, exclude?: ExcludeOption): { gzip: Buffer; count: number } | null {
    const key = getCacheFileName(type, exclude);
    return this.memoryCache.get(key) ?? null;
  }

  private async generateAll(): Promise<void> {
    this.logger.log('Generating static JSON cache for all countries…');

    if (!existsSync(CACHE_DIR)) {
      mkdirSync(CACHE_DIR, { recursive: true });
    }

    const [withAll, withStates, onlyCountries] = await Promise.all([
      this.repo.findAll({ includeStates: true, includeCities: true }),
      this.repo.findAll({ includeStates: true, includeCities: false }),
      this.repo.findAll({ includeStates: false, includeCities: false }),
    ]);

    const fullVariants = new Map<string, CountryEntity[]>();
    fullVariants.set(this.hierarchyKey({ includeStates: true, includeCities: true }), withAll);
    fullVariants.set(this.hierarchyKey({ includeStates: true, includeCities: false }), withStates);
    fullVariants.set(this.hierarchyKey({ includeStates: false, includeCities: false }), onlyCountries);

    for (const combo of ALL_CACHE_COMBOS) {
      const options = parseExclude(combo.exclude);
      const full = fullVariants.get(this.hierarchyKey(options))!;
      const data = combo.type === ResponseType.SIMPLE ? full.map(toSimpleCountry) : full;

      const fileName = getCacheFileName(combo.type, combo.exclude);
      const filePath = join(CACHE_DIR, fileName);

      const json = JSON.stringify(data);
      const gzip = gzipSync(json, { level: 9 });

      writeFileSync(filePath, gzip);
      this.memoryCache.set(fileName, { gzip, count: data.length });

      const ratio = ((1 - gzip.length / Buffer.byteLength(json)) * 100).toFixed(1);
      this.logger.debug(
        `  ✔ ${fileName} (${data.length} countries, ${(gzip.length / 1024).toFixed(0)} KB, ${ratio}% compression)`,
      );
    }

    this.logger.log(`Static JSON cache ready — ${this.memoryCache.size} files generated in ${CACHE_DIR}`);
  }

  private hierarchyKey(opts: HierarchyOptions): string {
    return `${opts.includeStates}-${opts.includeCities}`;
  }
}
