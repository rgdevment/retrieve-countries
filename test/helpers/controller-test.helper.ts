import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from '../../src/modules/countries/countries.service';

const CACHE_MOCK = { get: jest.fn(), set: jest.fn() };

export interface ControllerTestContext<C> {
  controller: C;
  service: CountriesService;
}

export async function createControllerTestModule<C>(
  controllerClass: Type<C>,
  serviceMethods: Record<string, jest.Mock>,
): Promise<ControllerTestContext<C>> {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [controllerClass],
    providers: [
      { provide: CountriesService, useValue: serviceMethods },
      { provide: CACHE_MANAGER, useValue: CACHE_MOCK },
      Reflector,
    ],
  }).compile();

  return {
    controller: module.get<C>(controllerClass),
    service: module.get<CountriesService>(CountriesService),
  };
}
