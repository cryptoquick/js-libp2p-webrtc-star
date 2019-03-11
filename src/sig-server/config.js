'use strict'

const debug = require('debug')
const log = debug('signalling-server')
log.error = debug('signalling-server:error')

module.exports = {
  log,
  hapi: {
    port: process.env.PORT || 13579,
    host: '0.0.0.0',
  },
  refreshPeerListIntervalMS: 10000
}
