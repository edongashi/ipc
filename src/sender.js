const cuid = require('cuid')
const { Message } = require('redis-smq')
const { getProducer } = require('./internal/producers')
const { getPubSub } = require('./internal/pubsub')
const { subscribe } = require('./receiver')

const DEFAULT_TTL = 10 * 1000

function getMessage(payload, configurer) {
  const message = new Message().setBody(payload).setTTL(DEFAULT_TTL)

  if (typeof configurer === 'function') {
    configurer(message)
  }

  return message
}

function sendMessage(queue, message) {
  return new Promise((resolve, reject) => {
    getProducer(queue).produceMessage(message, (err) => {
      if (err) {
        return reject(err)
      }

      resolve()
    })
  })
}

function cast(queue, body, configurer) {
  return sendMessage(queue, getMessage({ type: 'cast', body }, configurer))
}

async function call(queue, body, configurer) {
  const callId = cuid()

  return new Promise(async (resolve, reject) => {
    const message = getMessage({ type: 'call', callId, body }, configurer)

    const unsubscribe = subscribe(`rpc.response.${callId}`, (result) => {
      clearTimeout(timeoutId)
      unsubscribe()
      resolve(result)
    })

    let timeoutId
    try {
      await sendMessage(queue, message)
      timeoutId = setTimeout(() => {
        unsubscribe()
        reject('timeout')
      }, message.getTTL())
    } catch (e) {
      unsubscribe()
      reject(e)
    }
  })
}

async function publish(channel, body) {
  return getPubSub().emit(channel, { type: 'publish', body })
}

module.exports = {
  cast,
  call,
  publish
}
