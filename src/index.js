const { cast, call, publish } = require('./sender')
const { consume, subscribe } = require('./receiver')
const { getStore, shutdownAllStores } = require('./store')
const { shutdownAllConsumers } = require('./internal/consumers')
const { shutdownAllProducers } = require('./internal/producers')
const { shutdownPubSub } = require('./internal/pubsub')

function shutdown() {
  shutdownAllConsumers()
  shutdownAllProducers()
  shutdownPubSub()
  shutdownAllStores()
}

module.exports = {
  cast,
  call,
  publish,
  consume,
  subscribe,
  shutdown,
  getStore
}
