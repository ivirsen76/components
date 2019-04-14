#!/usr/bin/env node
const { generateDump } = require('../../db.js')

const [dumpName] = process.argv.slice(2)
;(async () => {
    await generateDump(dumpName)
    console.info('The database dump has been generated')
    process.exit()
})()
