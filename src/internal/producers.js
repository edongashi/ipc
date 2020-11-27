const { Producer } = require('redis-smq')
const { queueConfig } = require('./config')

let producerCache = {}

function getProducer(queue) {
  if (queue in producerCache) {
    return producerCache[queue]
  }

  const producer = new Producer(queue, queueConfig)
  producerCache[queue] = producer
  return producer
}

function shutdownProducer(queue) {
  const producer = producerCache[queue]
  if (producer) {
    producer.shutdown()
    delete producerCache[queue]
  }
}

function shutdownAllProducers() {
  for (const producer of Object.values(producerCache)) {
    producer.shutdown()
  }

  producerCache = {}
}

module.exports = {
  getProducer,
  shutdownProducer,
  shutdownAllProducers
}
