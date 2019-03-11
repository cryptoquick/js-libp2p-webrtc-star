'use strict'

const Hapi = require('hapi')
const config = require('./config')
const log = config.log
const epimetheus = require('epimetheus')
const path = require('path')

exports = module.exports

exports.start = async (options = {}, callback) => {
  if (typeof options === 'function') {
    callback = options
    options = {
      ...config.hapi,
    }
  }

  const http = new Hapi.Server({
    ...config.hapi,
    ...options
  })

  await http.register(require('inert'))

  log('signaling server has started on: ' + http.info.uri)

  http.peers = require('./routes-ws')(http, options.metrics).peers

  http.route({
    method: 'GET',
    path: '/',
    options: {
      cors: true,
    },
    handler: (request, reply) => reply.file(path.join(__dirname, 'index.html'), {
      confine: false
    })
  })

  await http.start()

  if (callback) callback(null, http)

  if (options.metrics) {
    epimetheus.instrument(http)
  }

  return http
}
