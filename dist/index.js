"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStore = exports.publish = exports.cast = exports.call = exports.subscribe = exports.consume = void 0;
exports.shutdown = shutdown;
const sender_1 = require("./sender");
const store_1 = require("./store");
var listener_1 = require("./listener");
Object.defineProperty(exports, "consume", { enumerable: true, get: function () { return listener_1.consume; } });
Object.defineProperty(exports, "subscribe", { enumerable: true, get: function () { return listener_1.subscribe; } });
var sender_2 = require("./sender");
Object.defineProperty(exports, "call", { enumerable: true, get: function () { return sender_2.call; } });
Object.defineProperty(exports, "cast", { enumerable: true, get: function () { return sender_2.cast; } });
Object.defineProperty(exports, "publish", { enumerable: true, get: function () { return sender_2.publish; } });
var store_2 = require("./store");
Object.defineProperty(exports, "getStore", { enumerable: true, get: function () { return store_2.getStore; } });
async function shutdown() {
    await (0, sender_1.shutdownSender)();
    await (0, store_1.shutdownStore)();
}
