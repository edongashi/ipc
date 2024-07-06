"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribe = subscribe;
exports.consume = consume;
const bullmq_1 = require("bullmq");
const connection_1 = require("./connection");
function subscribe(channel, listener) {
    let connection = (0, connection_1.newConnection)();
    connection.subscribe(channel);
    connection.on('message', (_channel, message) => {
        const data = JSON.parse(message);
        listener(data);
    });
    return async () => {
        if (!connection)
            return;
        const c = connection;
        connection = null;
        c.quit();
    };
}
function consume(queue, listener) {
    let connection = (0, connection_1.newConnection)({ maxRetriesPerRequest: null });
    let worker = new bullmq_1.Worker(queue, async (job) => {
        if (job.name === 'cast') {
            listener(job.data);
        }
        else {
            return listener(job.data);
        }
    }, { connection });
    return async () => {
        if (!worker)
            return;
        const w = worker;
        worker = null;
        await w.close();
        const c = connection;
        connection = null;
        try {
            await c.quit();
        }
        catch { }
    };
}
