import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { CacheModuleOption } from './cache-module-options.interface';
export interface SharedCacheConfigurationFactory {
  createSharedConfiguration(): Promise<CacheModuleOption> | CacheModuleOption;
}
export interface CacheModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  isGlobal: boolean;
  cacheType: 'local' | 'redis';
  provider?: any;
  useExisting?: Type<SharedCacheConfigurationFactory>;
  useClass?: Type<SharedCacheConfigurationFactory>;
  useFactory?: (...args: any[]) => Promise<Omit<CacheModuleOption, 'isGlobal' | 'cacheType'>> | Omit<CacheModuleOption, 'isGlobal' | 'cacheType'>;
  inject?: FactoryProvider['inject'];
}
