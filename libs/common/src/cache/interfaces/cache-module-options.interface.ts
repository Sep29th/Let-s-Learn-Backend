import { CreateCacheOptions } from 'cache-manager';
import { CacheOption } from './cache-option.interface';

export type CacheModuleOption = Omit<CreateCacheOptions, 'stores' | 'ttl'> & CacheOption;
