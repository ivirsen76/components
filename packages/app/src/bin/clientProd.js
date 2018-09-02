#!/usr/bin/env node
const spawn = require('cross-spawn')
require('dotenv').config()

const serve = require.resolve('serve/bin/serve.js')
const result = spawn.sync('node', [serve, '-l', process.env.IE_CLIENT_PORT, '-s', 'build'], {
    stdio: 'inherit',
})
process.exit(result.status)
