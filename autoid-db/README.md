# Automatic Indoor Garden Database

## Usage

``` js

const setupDatabase = require('autoid-db')

setupDatabase(config).then(db => {
    const { Agent, Metric } = db
}).catch(err => console.error(err))

```