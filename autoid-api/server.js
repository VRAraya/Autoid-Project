'use strict'

const http = require('http')
const chalk = require('chalk')
const express = require('express')

const api = require('./api')

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

// Middlewares
app.use('/api', api)

// Express Error Handler Middleware
app.use((err, req, res, next) => {
  debug(`Error: ${error.message}`)

  if(err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message})
  }

  res.status(500).send({error: err.message})
})
server.listen(port, () => {
  console.log(`${chalk.green('[autoid-api]')} server listening on port ${port}`)
})
