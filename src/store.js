const Keyv = require('keyv')
const KeyvRedis = require('@keyv/redis')
const { keyvConfig } = require('./internal/config')

let storeCache = {}

function getStore(namespace) {
  if (!namespace) {
    namespace = keyvConfig.defaultNamespace
  }

  if (namespace in storeCache) {
    return storeCache[namespace]
  }

  const keyvRedis = new KeyvRedis(keyvConfig.redis)
  const keyv = new Keyv({ store: keyvRedis, namespace })

  Object.defineProperty(keyv, 'redis', {
    enumerable: false,
    value: keyvRedis.redis
  })

  storeCache[namespace] = keyv

  return keyv
}

function shutdownStore(namespace) {
  const store = storeCache[namespace]
  if (store) {
    store.redis.disconnect()
    delete storeCache[namespace]
  }
}

function shutdownAllStores() {
  for (const store of Object.values(storeCache)) {
    store.redis.disconnect()
  }

  storeCache = {}
}

module.exports = {
  getStore,
  shutdownStore,
  shutdownAllStores
}
