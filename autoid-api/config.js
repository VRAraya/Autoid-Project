'use strict'

const debug = require('debug')('autoid:api:db')

module.exports = {
  db: {
    database: process.env.DB_NAME || 'autoidgarden',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'manjaro123',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: s => debug(s)
  },
  auth: {
    secret: process.env.SECRET || 'manjaro123'
  }
}
