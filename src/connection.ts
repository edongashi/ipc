import Redis, { RedisOptions } from 'ioredis';

export function newConnection(options: RedisOptions = {}) {
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    ...options,
  });
}
