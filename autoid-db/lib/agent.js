'use strict'

module.exports = function setupAgent (AgentModel) {
  function createOrUpdate (agent) {
    const cond = {
      where: {
        uuid: agent.uuid
      }
    }
  }

  function findById (id) {
    return AgentModel.findById(id)
  }

  return {
    createOrUpdate,
    findById
  }
}