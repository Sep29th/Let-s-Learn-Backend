import { DynamicModule, Provider } from '@nestjs/common';
import { CacheModuleAsyncOptions, CacheModuleOption, SharedCacheConfigurationFactory } from './interfaces';
import { createCache } from 'cache-manager';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { LOCAL_PROVIDE, REDIS_PROVIDE } from './constants';
import KeyvRedis from '@keyv/redis';

export class CacheModule {
  private static defaultCacheModuleOptions: CacheModuleOption = {
    cacheType: 'local',
    isGlobal: true,
    nonBlocking: true,
    options: { ttl: 60000, lruSize: 5000 },
  };

  static forRoot(options?: CacheModuleOption): DynamicModule {
    const finalOptions = options ?? this.defaultCacheModuleOptions;
    const module: DynamicModule = { module: CacheModule };
    module.global = finalOptions.isGlobal;
    if (finalOptions.cacheType == 'local') {
      module.providers = [
        {
          provide: options.provider ?? LOCAL_PROVIDE,
          useValue: createCache({ ...finalOptions, stores: [new Keyv({ store: new CacheableMemory(finalOptions.options) })] }),
        },
      ];
      module.exports = [options.provider ?? LOCAL_PROVIDE];
    } else if (finalOptions.cacheType == 'redis') {
      module.providers = [
        {
          provide: options.provider ?? REDIS_PROVIDE,
          useValue: createCache({ ...finalOptions, stores: [new Keyv({ store: new KeyvRedis(finalOptions.options) })] }),
        },
      ];
      module.exports = [options.provider ?? LOCAL_PROVIDE];
    }
    return module;
  }

  static forRootAsync(options: CacheModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);
    const provideKey = options.provider ?? (options.cacheType === 'local' ? LOCAL_PROVIDE : REDIS_PROVIDE);
    const cacheProvider = this.createAsyncCacheProvider(provideKey);

    return {
      module: CacheModule,
      global: options.isGlobal,
      imports: options.imports || [],
      providers: [...asyncProviders, cacheProvider],
      exports: [provideKey],
    };
  }

  private static createAsyncProviders(options: CacheModuleAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: 'CACHE_MODULE_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    const injectProvider = options.useExisting || options.useClass;
    if (!injectProvider) {
      throw new Error('Invalid configuration. Must provide useFactory, useClass, or useExisting for async configuration.');
    }

    return [
      {
        provide: 'CACHE_MODULE_OPTIONS',
        useFactory: async (optionsFactory: SharedCacheConfigurationFactory) => await optionsFactory.createSharedConfiguration(),
        inject: [injectProvider],
      },
      ...(options.useClass ? [{ provide: injectProvider, useClass: options.useClass }] : []),
    ];
  }

  private static createAsyncCacheProvider(provideKey: string): Provider {
    return {
      provide: provideKey,
      useFactory: async (cacheOptions: CacheModuleOption) => {
        const store = cacheOptions.cacheType === 'local' ? new CacheableMemory(cacheOptions.options) : new KeyvRedis(cacheOptions.options);

        return createCache({
          ...cacheOptions,
          stores: [new Keyv({ store })],
        });
      },
      inject: ['CACHE_MODULE_OPTIONS'],
    };
  }
}
