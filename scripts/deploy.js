#!/usr/bin/env babel-node
import spawn from 'cross-spawn'

const version = `app-${Date.now()}`
const result = spawn.sync('eb', ['deploy', '-l', version], {
    stdio: 'inherit',
})
process.exit(result.status)
