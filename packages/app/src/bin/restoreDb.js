#!/usr/bin/env node
const colors = require('colors/safe')
const { restoreDb } = require('../../db.js')

const [dumpName] = process.argv.slice(2)

restoreDb(dumpName)

console.info(colors.green('The database has been restored'))
process.exit()
