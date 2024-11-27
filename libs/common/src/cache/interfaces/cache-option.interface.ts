import { Redis, Cluster } from 'ioredis';

type KeyvRedisOptions = {
  [K in keyof Redis]?: Redis[K];
} & {
  uri?: string;
  dialect?: string;
  useRedisSets?: boolean;
};
type KeyvUriOptions = string | KeyvRedisOptions | Redis | Cluster;

type CacheableMemoryOptions = {
  ttl?: number | string;
  useClone?: boolean;
  lruSize?: number;
  checkInterval?: number;
};

export interface CacheOptionBase {
  isGlobal: boolean;
  provider?: any;
}

export interface CacheLocalOption extends CacheOptionBase {
  cacheType: 'local';
  options?: CacheableMemoryOptions;
}

export interface CacheRedisOption extends CacheOptionBase {
  cacheType: 'redis';
  uri: KeyvRedisOptions | KeyvUriOptions;
  options?: KeyvRedisOptions;
}

export type CacheOption = CacheLocalOption | CacheRedisOption;
