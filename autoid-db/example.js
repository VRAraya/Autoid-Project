'use strict'

require('longjohn')
setTimeout(() => {
  throw new Error('boo')
}, 2000)
