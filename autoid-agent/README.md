# Automatic Indoor Garden Agent

## Usage

``` js

const AutoIdAgent = require('autoid-agent')

const agent = new AutoIdAgent({
  interval: 2000
})

agent. connect()

agent.on('agent/message', payload => {
  console.log(payload)
})

setTimeout(() => agent.disconnect(), 20000)

```