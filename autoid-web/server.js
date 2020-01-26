'use strict'

const debug = require('debug')('autoid:web')
const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const chalk = require('chalk')

const { pipe, handleFatalError } = require('autoid-utils')
const AutoidAgent = require('autoid-agent')

const port = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const agent = new AutoidAgent()

app.use(express.static(path.join(__dirname, 'public')))

// Socket.io / WebSockets
io.on('connect', socket => {
  debug(`Connected ${socket.id}`)

  pipe(agent, socket)
})

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

server.listen(port, () => {
  console.log(`${chalk.green('[autoid-web]')} server listening on port ${port}`)
  agent.connect()
})
