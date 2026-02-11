import { Global, Module } from '@nestjs/common';
import { DatabaseMigration } from './database.migration';
import { DatabaseProvider } from './database.provider';

@Global()
@Module({
  providers: [DatabaseProvider, DatabaseMigration],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
