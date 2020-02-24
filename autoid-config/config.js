'use strict'

module.exports = ({ setup = false, logging = () => {} } = {}) => ({
  db: {
    database: process.env.DB_NAME || 'autoidgarden',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Ubuntu123++',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging,
    setup
  },
  auth: {
    secret: process.env.SECRET || 'Ubuntu123++'
  },
  web: {
    endpoint: process.env.API_ENDPOINT || 'http://localhost:3000',
    serverHost: process.env.SERVER_HOST || 'http://localhost:8080',
    mqttHost: process.env.MQTT_HOST || 'mqtt://localhost',
    apiToken:
      process.env.API_TOKEN ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJhZG1pbiI6dHJ1ZSwicGVybWlzc2lvbnMiOlsiYWdlbnRzOiByZWFkIiwibWV0cmljczogcmVhZCJdLCJpYXQiOjE1ODAwNDk3MzZ9.ku6sCgSudcEQehj422mNdp-4cRtESkiZiGDmoclOOb0'
  }
})
