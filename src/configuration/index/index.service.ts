import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from '../../common/schemas/country.schema';

@Injectable()
export class IndexService {
  constructor(@InjectModel(Country.name) private readonly countryModel: Model<Country>) {}

  /**
   * Ensure that a text index exists on the specified fields
   *
   * WARNING: This method should only be executed when necessary to create or refresh indexes.
   * Modifying indexes can have significant performance implications and may lead to increased
   * downtime, especially in production environments. Ensure that creating or modifying indexes
   * is carefully planned and performed during maintenance windows or non-peak hours.
   *
   * Running this command may result in the recreation of existing indexes, potentially causing
   * MongoDB to rebuild the indexes, which could consume resources and temporarily slow down the database.
   * Proceed with caution and always make sure to test in a non-production environment before applying any changes.
   *
   * @param fields
   * @param indexName
   */
  async ensureTextIndex(fields: string[], indexName: string) {
    try {
      const existingIndexes = await this.countryModel.collection.indexes();
      const indexExists = existingIndexes.some(index => index.name === indexName);

      if (!indexExists) {
        console.log(`Creating text index: ${indexName}`);
        const indexFields = fields.reduce((acc, field) => {
          acc[field] = 'text';
          return acc;
        }, {});
        await this.countryModel.collection.createIndex(indexFields, { name: indexName });
        console.log(`Text index ${indexName} created successfully.`);
      } else {
        console.log(`Text index ${indexName} already exists.`);
      }
    } catch (error) {
      console.log(`Failed to create text index ${indexName}:`, error);
      throw error;
    }
  }
}