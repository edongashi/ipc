import { Queue, QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { newConnection } from './connection';

const DEFAULT_TTL = 10 * 1000;

let queueCache = new Map<string, [Queue, Redis]>();
let queueEventsCache = new Map<string, [QueueEvents, Redis]>();

function getQueue(name: string) {
  if (queueCache.has(name)) return queueCache.get(name)![0];
  const connection = newConnection({ maxRetriesPerRequest: null });
  const queue = new Queue(name, { connection });
  queueCache.set(name, [queue, connection]);
  return queue;
}

function getQueueEvents(name: string) {
  if (queueEventsCache.has(name)) return queueEventsCache.get(name)![0];
  const connection = newConnection({ maxRetriesPerRequest: null });
  const queueEvents = new QueueEvents(name, { connection });
  queueEventsCache.set(name, [queueEvents, connection]);
  return queueEvents;
}

export function cast<TData>(queue: string | Queue, data: TData) {
  queue = typeof queue === 'string' ? getQueue(queue) : queue;
  return queue.add('cast', data, {
    removeOnComplete: true,
    removeOnFail: true,
  });
}

export async function call<TData, TResponse = unknown>(
  queue: string | Queue,
  data: TData,
  ttl: number = DEFAULT_TTL,
): Promise<TResponse> {
  queue = typeof queue === 'string' ? getQueue(queue) : queue;
  const queueEvents = getQueueEvents(queue.name);
  const job = await queue.add('call', data, {
    removeOnComplete: true,
    removeOnFail: true,
  });
  return (await job.waitUntilFinished(queueEvents, ttl)) as TResponse;
}

let publishConnection: Redis | null = null;

export function publish<TData>(channel: string, data: TData) {
  if (!publishConnection) {
    publishConnection = newConnection();
  }
  return publishConnection.publish(channel, JSON.stringify(data));
}

export async function shutdownSender() {
  for (const [queueEvents, connection] of queueEventsCache.values()) {
    await queueEvents.close();
    try {
      await connection.quit();
    } catch {}
  }
  queueEventsCache = new Map();

  for (const [queue, connection] of queueCache.values()) {
    await queue.close();
    try {
      await connection.quit();
    } catch {}
  }
  queueCache = new Map();

  if (publishConnection) {
    const conn = publishConnection;
    publishConnection = null;
    await conn.quit();
  }
}
