'use strict'

const chalk = require('chalk')
const agentFixtures = require('./fixtures/agent')
const metricFixtures = require('./fixtures/metric')

function parsePayload (payload) {
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

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

function handleError (err) {
  console.error(`${chalk.red('[error]')} ${err.message}`)
  console.error(err.stack)
}

module.exports = {
  parsePayload,
  handleFatalError,
  handleError,
  agentFixtures,
  metricFixtures
}
