'use strict'

const debug = require('debug')('autoid:api:tests')
const test = require('ava')
const util = require('util')
const request = require('supertest')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

const { agentFixtures, metricFixtures } = require('autoid-utils')
const serverConfig = require('autoid-config')
const auth = require('../auth')
const sign = util.promisify(auth.sign)

let sandbox = null
let server = null
let dbStub = null
let token = null
const AgentStub = {}
const MetricStub = {}

const uuid = 'yyy-yyy-yyy'
const wrongUuid = 'xxx-yyy-yyy'
const type = 'air temperature'

const config = serverConfig({
  logging: s => debug(s)
})

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()

  dbStub = sandbox.stub()
  dbStub.returns(
    Promise.resolve({
      Agent: AgentStub,
      Metric: MetricStub
    })
  )

  AgentStub.findConnected = sandbox.stub()
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected))

  AgentStub.findByUuid = sandbox.stub()
  AgentStub.findByUuid
    .withArgs(uuid)
    .returns(Promise.resolve(agentFixtures.byUuid(uuid)))
  AgentStub.findByUuid.withArgs(wrongUuid).returns(Promise.resolve(null))

  MetricStub.findByAgentUuid = sandbox.stub()
  MetricStub.findByAgentUuid
    .withArgs(uuid)
    .returns(Promise.resolve(metricFixtures.byAgentUuid(uuid)))
  MetricStub.findByAgentUuid.withArgs(wrongUuid).returns(Promise.resolve(null))

  MetricStub.findByTypeAgentUuid = sandbox.stub()
  MetricStub.findByTypeAgentUuid
    .withArgs(type, uuid)
    .returns(Promise.resolve(metricFixtures.byTypeAgentUuid(type, uuid)))
  MetricStub.findByTypeAgentUuid
    .withArgs(type, wrongUuid)
    .returns(Promise.resolve(null))

  token = await sign(
    {
      admin: true,
      username: 'root',
      permissions: ['metrics: read']
    },
    config.auth.secret
  )

  const api = proxyquire('../api', {
    'autoid-db': dbStub
  })

  server = proxyquire('../server', {
    './api': api
  })
})

test.afterEach(() => {
  sandbox && sinon.resetHistory()
})

test.serial.cb('/api/agents', t => {
  request(server)
    .get('/api/agents')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(agentFixtures.connected)
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agents - not authorized', t => {
  request(server)
    .get('/api/agents')
    .expect(401)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        console.log(`Error in Test ${err.message}`)
      }
      t.is(res.statusCode, 401, 'Error must be Unauthorized User')
      t.end()
    })
})

test.serial.cb('/api/agent/:uuid', t => {
  request(server)
    .get(`/api/agent/${uuid}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(agentFixtures.byUuid(uuid))
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/agent/:uuid - not found', t => {
  request(server)
    .get(`/api/agent/${wrongUuid}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        console.log(err)
      }
      t.truthy(res.body.error, 'should return an error')
      t.regex(res.body.error, /not found/, 'Error should contains not found')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid', t => {
  request(server)
    .get(`/api/metrics/${uuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(metricFixtures.byAgentUuid(uuid))
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid - not found', t => {
  request(server)
    .get(`/api/metrics/${wrongUuid}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        console.log(err)
      }
      t.truthy(res.body.error, 'should return an error')
      t.regex(res.body.error, /not found/, 'Error should contains not found')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type', t => {
  request(server)
    .get(`/api/metrics/${uuid}/${type}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const body = JSON.stringify(res.body)
      const expected = JSON.stringify(
        metricFixtures.byTypeAgentUuid(type, uuid)
      )
      t.deepEqual(body, expected, 'response body should be the expected')
      t.end()
    })
})

test.serial.cb('/api/metrics/:uuid/:type - not found', t => {
  request(server)
    .get(`/api/metrics/${wrongUuid}/${type}`)
    .expect(404)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        console.log(err)
      }
      t.truthy(res.body.error, 'should return an error')
      t.regex(res.body.error, /not found/, 'Error should contains not found')
      t.end()
    })
})
