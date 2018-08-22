#!/usr/bin/env node
const spawn = require('cross-spawn')

const version = `app-${Date.now()}`
const result = spawn.sync('eb', ['deploy', '-l', version], {
    stdio: 'inherit',
})
process.exit(result.status)
