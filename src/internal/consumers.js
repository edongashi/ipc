const { Consumer } = require('redis-smq')
const { queueConfig } = require('./config')
const { getPubSub } = require('./pubsub')

let consumers = []

function buildConsumer(queue, handler) {
  class StandardConsumer extends Consumer {
    constructor(handler) {
      super(queueConfig)
      this.handler = handler
    }

    async consume(message, cb) {
      try {
        const result = await this.handler(message.body)
        cb()
        if (message.type === 'call') {
          getPubSub().emit(`rpc.response.${message.callId}`, {
            type: 'rpc.response',
            body: typeof result === 'undefined' ? null : result
          })
        }
      } catch (e) {
        cb(e)
      }
    }
  }

  StandardConsumer.queueName = queue
  const consumer = new StandardConsumer(handler)
  consumers.push(consumer)
  return consumer
}

function shutdownAllConsumers() {
  for (const consumer of consumers) {
    consumer.shutdown()
  }

  consumers = []
}

module.exports = {
  buildConsumer,
  shutdownAllConsumers
}
