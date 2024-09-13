import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { IndexService } from '../../configuration/index/index.service';

@Injectable()
@Command({
  name: 'ensure-indexes',
  description: 'Ensure that the necessary indexes are created',
})
export class EnsureIndexesCommand extends CommandRunner {
  constructor(private readonly indexService: IndexService) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.indexService.ensureTextIndex(['name', 'capital'], 'countries_text');
      console.log('Indexes ensured successfully.');
    } catch (error) {
      console.error('Error ensuring indexes:', error);
    }
  }
}
