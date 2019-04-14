#!/usr/bin/env node
const colors = require('colors/safe')
const { generateDump } = require('../../db.js')

const [dumpName] = process.argv.slice(2)
;(async () => {
    await generateDump(dumpName)
    console.info(colors.green('The database dump has been generated'))
    process.exit()
})()
