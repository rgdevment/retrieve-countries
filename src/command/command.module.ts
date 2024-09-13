import { Module } from '@nestjs/common';
import { IndexModule } from '../configuration/index/index.module';
import { EnsureIndexesCommand } from './ensure-index/ensure-index.command';

@Module({
  imports: [IndexModule],
  providers: [EnsureIndexesCommand],
})
export class CommandsModule {}
