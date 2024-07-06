"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newConnection = newConnection;
const ioredis_1 = __importDefault(require("ioredis"));
function newConnection(options = {}) {
    return new ioredis_1.default({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT || 6379),
        ...options,
    });
}
