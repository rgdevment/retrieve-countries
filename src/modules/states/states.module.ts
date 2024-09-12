import { Module } from '@nestjs/common';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [StatesController],
  providers: [StatesService],
})
export class StatesModule {}
