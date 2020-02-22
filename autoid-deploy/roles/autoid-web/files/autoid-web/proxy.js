'use strict'

const express = require('express')
const request = require('request-promise-native')
const serverConfig = require('autoid-config')

const api = express.Router()

const config = serverConfig({
  logging: s => debug(s)
})

api.get('/agents', async (req, res, next) => {
  const options = {
    method: 'GET',
    uri: `${config.web.endpoint}/api/agents`,
    headers: {
      // prettier-ignore
      'Authorization': `Bearer ${config.web.apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(e)
  }

  res.send(result)
})

api.get('/agent/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  const options = {
    method: 'GET',
    uri: `${config.web.endpoint}/api/agent/${uuid}`,
    headers: {
      // prettier-ignore
      'Authorization': `Bearer ${config.web.apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(new Error(e.error.error))
  }

  res.send(result)
})

api.get('/metrics/:uuid', async (req, res, next) => {
  const { uuid } = req.params
  const options = {
    method: 'GET',
    uri: `${config.web.endpoint}/api/metrics/${uuid}`,
    headers: {
      // prettier-ignore
      'Authorization': `Bearer ${config.web.apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(new Error(e.error.error))
  }

  res.send(result)
})

api.get('/metrics/:uuid/:type', async (req, res, next) => {
  const { uuid, type } = req.params
  const options = {
    method: 'GET',
    uri: `${config.web.endpoint}/api/metrics/${uuid}/${type}`,
    headers: {
      // prettier-ignore
      'Authorization': `Bearer ${config.web.apiToken}`
    },
    json: true
  }

  let result
  try {
    result = await request(options)
  } catch (e) {
    return next(new Error(e.error.error))
  }

  res.send(result)
})

module.exports = api
