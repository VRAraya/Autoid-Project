'use strict'

module.exports = ({ setup = false, logging = () => {} } = {}) => ({
  db: {
    database: process.env.DB_NAME || 'AutoIndoorGarden',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging,
    setup
  },
  auth: {
    secret: process.env.SECRET || 'test'
  },
  web: {
    endpoint: process.env.API_ENDPOINT || 'http://localhost:3000',
    serverHost: process.env.SERVER_HOST || 'http://localhost:8080',
    mqttHost: process.env.MQTT_HOST || 'mqtt://localhost',
    apiToken:
      process.env.API_TOKEN ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJhZG1pbiI6dHJ1ZSwicGVybWlzc2lvbnMiOlsiYWdlbnRzOiByZWFkIiwibWV0cmljczogcmVhZCJdLCJpYXQiOjE1MTYyMzkwMjJ9._sGfRGi52U8NXbEwn7fBRMvorQu6j8GvwfBKn3OmfyY'
  }
})
