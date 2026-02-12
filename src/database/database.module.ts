import { Global, Module } from '@nestjs/common';
import { DatabaseInitializer } from './database.initializer';
import { DatabaseProvider } from './database.provider';

@Global()
@Module({
  providers: [DatabaseProvider, DatabaseInitializer],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
