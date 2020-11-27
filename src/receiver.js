const { getPubSub } = require('./internal/pubsub')
const { buildConsumer } = require('./internal/consumers')

function consume(queue, handler) {
  const consumer = buildConsumer(queue, handler)
  consumer.run()
  return () => consumer.shutdown()
}

function subscribe(channel, handler) {
  return getPubSub().on(channel, ({ body }) => handler(body))
}

module.exports = {
  consume,
  subscribe
}
