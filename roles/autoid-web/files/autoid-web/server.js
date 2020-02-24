'use strict'

if (process.env.NODE_ENV !== 'production') {
  require('longjohn')
}
const debug = require('debug')('autoid:web')
const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')

const { pipe, handleFatalError } = require('autoid-utils')
const AutoidAgent = require('autoid-agent')
const proxy = require('./proxy')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const agent = new AutoidAgent()

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', proxy)

// Socket.io / WebSockets
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

// Express Error Handler Middleware
app.use((err, req, res, next) => {
  debug(`Error: ${err.message}`)

  if (err.message.match(/not found/)) {
    return res.status(404).send({ error: err.message })
  }
  if (err.name === 'UnauthorizedError') {
    return res.status(401).send({ error: err.message })
  }

  res.status(500).send({ error: err.message })
})

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[autoid-web]')} server listening on port ${port}`)
  agent.connect()
})
