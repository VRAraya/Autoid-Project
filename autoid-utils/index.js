'use strict'

const chalk = require('chalk')
const agentFixtures = require('./fixtures/agent')
const metricFixtures = require('./fixtures/metric')
const auth = require('./auth')

function pipe(source, target) {
  if (!source.emit || !target.emit) {
    throw TypeError("Please pass EventEmitter's as argument")
  }

  const emit = (source._emit = source.emit)

  source.emit = function() {
    emit.apply(source, arguments)
    target.emit.apply(target, arguments)
    return source
  }
}

function parsePayload(payload) {
  if (payload instanceof Buffer) {
    payload = payload.toString('utf8')
  }

  try {
    payload = JSON.parse(payload)
  } catch (e) {
    payload = null
  }

  return payload
}

function handleFatalError(err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function handleError(err) {
  console.error(`${chalk.red('[error]')} ${err.message}`)
  console.error(err.stack)
}

module.exports = {
  pipe,
  parsePayload,
  handleFatalError,
  handleError,
  agentFixtures,
  metricFixtures,
  auth
}
