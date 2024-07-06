import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { newConnection } from './connection';

export type ShutdownFunc = () => void;

export function subscribe<TData = unknown>(
  channel: string,
  listener: (data: TData) => void,
): ShutdownFunc {
  let connection: Redis | null = newConnection();

  connection.subscribe(channel);
  connection.on('message', (_channel, message) => {
    const data = JSON.parse(message);
    listener(data);
  });

  return async () => {
    if (!connection) return;
    const c = connection;
    connection = null;
    c.quit();
  };
}

export function consume<TResult, TData = unknown>(
  queue: string,
  listener: (data: TData) => TResult,
): ShutdownFunc {
  let connection: Redis | null = newConnection({ maxRetriesPerRequest: null });
  let worker: Worker | null = new Worker(
    queue,
    async (job) => {
      if (job.name === 'cast') {
        listener(job.data);
      } else {
        return listener(job.data);
      }
    },
    { connection },
  );

  return async () => {
    if (!worker) return;

    const w = worker;
    worker = null;
    await w.close();

    const c = connection!;
    connection = null;
    try {
      await c.quit();
    } catch {}
  };
}
