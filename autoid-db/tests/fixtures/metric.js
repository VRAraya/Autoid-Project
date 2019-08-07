'use strict'

const agentFixtures = require('./agent')

const metric = {
  id: 1,
  agentId: 1,
  type: 'air temperature',
  value: '20',
  createdAt: new Date(),
  updateAt: new Date()
}

function extend (obj, values) {
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

const metrics = [
  metric,
  extend(metric, { id: 2, agentId: 1, type: 'air humidity', value: '40' }),
  extend(metric, { id: 3, agentId: 2, type: 'soil temperature', value: '200' }),
  extend(metric, { id: 4, agentId: 2, type: 'air humidity', value: '50' }),
  extend(metric, { id: 5, agentId: 2, type: 'soil humidity', value: '800' }),
  extend(metric, {
    id: 6,
    agentId: 1,
    type: 'soil temperature',
    value: '900',
    createdAt: new Date('2018-09-14T17:51:53.242Z')
  })
]

function getAgentId(uuid) {
  let agent = agentFixtures.byUuid(uuid)
  return agent === undefined ? false : agent.id
}

function byAgentUuid(uuid) {
  let id = getAgentId(uuid)
  if (id) {
    let s = new Set(metrics.filter(m => m.agentId === id).map(m => m.type))
    return [...s]
  }
  return []
}

function byTypeAgentUuid(type, uuid) {
  let id = getAgentId(uuid)
  if (id) {
    return metrics
      .filter(m => m.agentId === id)
      .filter(m => m.type === type)
      .map(m => ({
        id: m.id,
        type: m.type,
        value: m.value,
        createdAt: m.createdAt
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20)
  }
  return []
}

module.exports = {
  single: metric,
  all: metrics,
  byAgentUuid,
  byTypeAgentUuid
}