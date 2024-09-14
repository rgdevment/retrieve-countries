import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IndexService } from '../../../src/configuration/index/index.service';
import { Country } from '../../../src/common/schemas/country.schema';

describe('IndexService', () => {
  let service: IndexService;
  let model: Model<Country>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndexService,
        {
          provide: getModelToken(Country.name),
          useValue: {
            collection: {
              indexes: jest.fn().mockResolvedValue([]),
              createIndex: jest.fn().mockResolvedValue({}),
              dropIndex: jest.fn().mockResolvedValue({}),
            },
          },
        },
      ],
    }).compile();

    service = module.get<IndexService>(IndexService);
    model = module.get<Model<Country>>(getModelToken(Country.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create text index when it does not exist', async () => {
    jest.spyOn(model.collection, 'indexes').mockResolvedValue([]);
    await service.ensureTextIndex(['name', 'capital'], 'countries_text');
    expect(model.collection.createIndex).toHaveBeenCalledWith(
      { name: 'text', capital: 'text' },
      { name: 'countries_text' },
    );
  });

  it('should not create text index when it already exists', async () => {
    jest.spyOn(model.collection, 'indexes').mockResolvedValue([
      {
        v: 2,
        key: { name: 'text', capital: 'text' },
        name: 'countries_text',
        weights: { name: 1, capital: 1 },
        default_language: 'english',
        language_override: 'language',
        textIndexVersion: 3,
      },
    ]);
    await service.ensureTextIndex(['name', 'capital'], 'countries_text');
    expect(model.collection.createIndex).not.toHaveBeenCalled();
  });

  it('should handle errors during index tex creation', async () => {
    jest.spyOn(model.collection, 'indexes').mockResolvedValue([]);
    jest.spyOn(model.collection, 'createIndex').mockRejectedValue(new Error('Index creation failed'));

    await expect(service.ensureTextIndex(['name', 'capital'], 'countries_text')).rejects.toThrow(
      'Index creation failed',
    );
  });

  it('should handle errors during index regular creation', async () => {
    jest.spyOn(model.collection, 'indexes').mockResolvedValue([]);
    jest.spyOn(model.collection, 'createIndex').mockRejectedValue(new Error('Index creation failed'));

    await expect(service.ensureIndexes(['name', 'capital'])).rejects.toThrow('Index creation failed');
  });

  it('should not create regular index when it already exists', async () => {
    jest.spyOn(model.collection, 'indexes').mockResolvedValue([
      {
        v: 2,
        key: { name: 1 },
        name: 'name_index',
        collation: { locale: 'en', strength: 1 },
      },
      {
        v: 2,
        key: { name: 1 },
        name: 'capital_index',
        collation: { locale: 'en', strength: 1 },
      },
    ]);
    await service.ensureIndexes(['name', 'capital']);
    expect(model.collection.createIndex).not.toHaveBeenCalled();
  });

  it('should create regular index when it does not exist', async () => {
    jest.spyOn(model.collection, 'indexes').mockResolvedValue([]);
    await service.ensureIndexes(['name', 'capital']);
    expect(model.collection.createIndex).toHaveBeenCalledWith(
      { name: 1 },
      { collation: { locale: 'en', strength: 1 }, name: 'name_index' },
    );
    expect(model.collection.createIndex).toHaveBeenCalledWith(
      { capital: 1 },
      { collation: { locale: 'en', strength: 1 }, name: 'capital_index' },
    );
  });
});
