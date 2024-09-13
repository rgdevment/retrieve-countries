import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IndexService } from './index.service';
import { Country, CountrySchema } from '../../common/schemas/country.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }])],
  providers: [IndexService],
  exports: [IndexService],
})
export class IndexModule {}
