import KeyvRedis from '@keyv/redis';
import Redis from 'ioredis';
import Keyv from 'keyv';
import { newConnection } from './connection';

let storeConnection: Redis | null = null;

const storeCache = new Map<string, Keyv>();

export function getStore(namespace?: string): Keyv {
  if (!storeConnection) {
    storeConnection = newConnection();
  }

  if (!namespace) namespace = 'ipc';

  if (storeCache.has(namespace)) return storeCache.get(namespace)!;

  const keyvRedis = new KeyvRedis(storeConnection);
  const keyv = new Keyv({ store: keyvRedis, namespace });
  storeCache.set(namespace, keyv);

  return keyv;
}

export async function shutdownStore() {
  if (storeConnection) {
    const c = storeConnection;
    storeConnection = null;
    await c.quit();
  }
}
