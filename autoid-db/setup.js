'use strict'

const debug = require('debug')('autoid:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')
const argv = require('yargs').boolean('y').argv
const setupConfig = require('autoid-config')
const { handleFatalError } = require('autoid-utils')

const prompt = inquirer.createPromptModule()

async function setup () {

  const ops = argv.y

  if (!ops) {
    const answer = await prompt({
      type: 'confirm',
      name: 'setup',
      massage: 'This will destroy your DataBase, Are you Sure?'
    })
    if (!answer.setup || ops) {
      return console.log('Nothing happened :)')
    }
  }  

  const config = setupConfig({
    setup: true,
    logging: s => debug(s)
  })

  await db(config).catch(handleFatalError)
  console.log('Success!')
  process.exit(0)
}

setup()
