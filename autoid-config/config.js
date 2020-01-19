'use strict'

module.exports = ({ setup = false, logging = () => {} } = {}) => ({
  database: process.env.DB_NAME || 'autoidgarden',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'Ubuntu123++',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging,
  setup
})
