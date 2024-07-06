"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cast = cast;
exports.call = call;
exports.publish = publish;
exports.shutdownSender = shutdownSender;
const bullmq_1 = require("bullmq");
const connection_1 = require("./connection");
const DEFAULT_TTL = 10 * 1000;
let queueCache = new Map();
let queueEventsCache = new Map();
function getQueue(name) {
    if (queueCache.has(name))
        return queueCache.get(name)[0];
    const connection = (0, connection_1.newConnection)({ maxRetriesPerRequest: null });
    const queue = new bullmq_1.Queue(name, { connection });
    queueCache.set(name, [queue, connection]);
    return queue;
}
function getQueueEvents(name) {
    if (queueEventsCache.has(name))
        return queueEventsCache.get(name)[0];
    const connection = (0, connection_1.newConnection)({ maxRetriesPerRequest: null });
    const queueEvents = new bullmq_1.QueueEvents(name, { connection });
    queueEventsCache.set(name, [queueEvents, connection]);
    return queueEvents;
}
function cast(queue, data) {
    queue = typeof queue === 'string' ? getQueue(queue) : queue;
    return queue.add('cast', data, {
        removeOnComplete: true,
        removeOnFail: true,
    });
}
async function call(queue, data, ttl = DEFAULT_TTL) {
    queue = typeof queue === 'string' ? getQueue(queue) : queue;
    const queueEvents = getQueueEvents(queue.name);
    const job = await queue.add('call', data, {
        removeOnComplete: true,
        removeOnFail: true,
    });
    return (await job.waitUntilFinished(queueEvents, ttl));
}
let publishConnection = null;
function publish(channel, data) {
    if (!publishConnection) {
        publishConnection = (0, connection_1.newConnection)();
    }
    return publishConnection.publish(channel, JSON.stringify(data));
}
async function shutdownSender() {
    for (const [queueEvents, connection] of queueEventsCache.values()) {
        await queueEvents.close();
        try {
            await connection.quit();
        }
        catch { }
    }
    queueEventsCache = new Map();
    for (const [queue, connection] of queueCache.values()) {
        await queue.close();
        try {
            await connection.quit();
        }
        catch { }
    }
    queueCache = new Map();
    if (publishConnection) {
        const conn = publishConnection;
        publishConnection = null;
        await conn.quit();
    }
}
