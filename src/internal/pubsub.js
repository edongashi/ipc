const NRP = require('node-redis-pubsub')
const { pubsubConfig } = require('./config')

let nrp = null

function getPubSub() {
  if (nrp) {
    return nrp
  }

  nrp = new NRP(pubsubConfig)
  return nrp
}

function shutdownPubSub() {
  if (nrp) {
    nrp.quit()
    nrp = null
  }
}

module.exports = {
  getPubSub,
  shutdownPubSub
}
