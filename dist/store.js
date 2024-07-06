"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStore = getStore;
exports.shutdownStore = shutdownStore;
const redis_1 = __importDefault(require("@keyv/redis"));
const keyv_1 = __importDefault(require("keyv"));
const connection_1 = require("./connection");
let storeConnection = null;
const storeCache = new Map();
function getStore(namespace) {
    if (!storeConnection) {
        storeConnection = (0, connection_1.newConnection)();
    }
    if (!namespace)
        namespace = 'ipc';
    if (storeCache.has(namespace))
        return storeCache.get(namespace);
    const keyvRedis = new redis_1.default(storeConnection);
    const keyv = new keyv_1.default({ store: keyvRedis, namespace });
    storeCache.set(namespace, keyv);
    return keyv;
}
async function shutdownStore() {
    if (storeConnection) {
        const c = storeConnection;
        storeConnection = null;
        await c.quit();
    }
}
