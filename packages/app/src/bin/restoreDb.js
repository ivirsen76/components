#!/usr/bin/env node
const { restoreDb } = require('../../db.js')

const [dumpName] = process.argv.slice(2)

restoreDb(dumpName)

console.info('The database has been restored')
process.exit()
