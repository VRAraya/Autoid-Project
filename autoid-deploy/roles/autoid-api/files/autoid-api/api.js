'use strict'

const debug = require('debug')('autoid:api:routes')
const express = require('express')
const auth = require('express-jwt')
const guard = require('express-jwt-permissions')()
const db = require('autoid-db')
const serverConfig = require('autoid-config')

const api = express.Router()

const config = serverConfig({
  logging: s => debug(s)
})

let services, Agent, Metric

api.use('*', auth(config.auth), async (req, res, next) => {
  if (!services) {
    debug('Connecting to database')
    try {
      services = await db(config.db)
    } catch (e) {
      return next(e)
    }
    Agent = services.Agent
    Metric = services.Metric
  }
  next()
})

api.get(
  '/agents',
  auth(config.auth),
  guard.check(['agents: read']),
  async (req, res, next) => {
    debug('A  has come to /agents')

    const { user } = req

    if (!user || !user.username) {
      return next(new Error('Not authorized'))
    }

    let agents = []
    try {
      if (user.admin) {
        agents = await Agent.findConnected()
      } else {
        agents = await Agent.findByUsername(user.username)
      }
    } catch (e) {
      return next(e)
    }
    res.send(agents)
  }
)

api.get(
  '/agent/:uuid',
  auth(config.auth),
  guard.check(['agents: read']),
  async (req, res, next) => {
    const { uuid } = req.params

    debug(` to /agent/${uuid}`)

    let agent
    try {
      agent = await Agent.findByUuid(uuid)
    } catch (e) {
      next(e)
    }

    if (!agent) {
      return next(new Error(`Agent not found with uuid ${uuid}`))
    }

    res.send(agent)
  }
)

api.get(
  '/metrics/:uuid',
  auth(config.auth),
  guard.check(['metrics: read']),
  async (req, res, next) => {
    const { uuid } = req.params

    debug(` to /metrics/${uuid}`)

    let metrics = []
    try {
      metrics = await Metric.findByAgentUuid(uuid)
    } catch (e) {
      return next(e)
    }

    if (!metrics || metrics.length === 0) {
      return next(new Error(`Metrics not found for agent with uuid ${uuid}`))
    }

    res.send(metrics)
  }
)

api.get(
  '/metrics/:uuid/:type',
  auth(config.auth),
  guard.check(['metrics: read']),
  async (req, res, next) => {
    const { user } = req

    if (!user || !user.username) {
      return next(new Error('Not authorized'))
    }

    const { uuid, type } = req.params

    debug(` to /metrics/${uuid}/${type}`)

    let metrics = []
    try {
      metrics = await Metric.findByTypeAgentUuid(type, uuid)
    } catch (e) {
      return next(e)
    }

    if (!metrics || metrics.length === 0) {
      return next(
        new Error(`Metrics (${type}) not found for agent with uuid ${uuid}`)
      )
    }

    res.send(metrics)
  }
)

module.exports = api
