import EventEmitter from 'node:events';

export interface CacheService {
  get: <T>(key: string) => Promise<T | null>;
  mget: <T>(keys: string[]) => Promise<T[]>;
  set: <T>(key: string, value: T, ttl?: number) => Promise<T>;
  mset: <T>(list: Array<{ key: string; value: T; ttl?: number }>) => Promise<Array<{ key: string; value: T; ttl?: number }>>;
  del: (key: string) => Promise<boolean>;
  mdel: (keys: string[]) => Promise<boolean>;
  clear: () => Promise<boolean>;
  wrap: <T>(key: string, fnc: () => T | Promise<T>, ttl?: number | ((value: T) => number), refreshThreshold?: number) => Promise<T>;
  on: <E extends keyof Events>(event: E, listener: Events[E]) => EventEmitter;
  off: <E extends keyof Events>(event: E, listener: Events[E]) => EventEmitter;
}

export type Events = {
  set: <T>(data: { key: string; value: T; error?: unknown }) => void;
  del: (data: { key: string; error?: unknown }) => void;
  clear: (error?: unknown) => void;
  refresh: <T>(data: { key: string; value: T; error?: unknown }) => void;
};
