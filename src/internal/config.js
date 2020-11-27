const host = process.env.REDIS_ADDRESS || '127.0.0.1'
const port = process.env.REDIS_PORT || 6379
const password = process.env.REDIS_PASSWORD || ''

module.exports = {
  queueConfig: {
    namespace: 'ipc_queue',
    redis: {
      driver: 'redis',
      options: { host, port, password }
    }
  },
  pubsubConfig: {
    scope: 'ipc_pubsub',
    host,
    port,
    auth: password
  },
  keyvConfig: {
    redis: { host, port, password },
    defaultNamespace: 'ipc_data'
  }
}
