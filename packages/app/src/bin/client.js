#!/usr/bin/env node
const spawn = require('cross-spawn')
const checkEnvironment = require('../checkEnvironment.js')

const webpackDevServer = require.resolve('webpack-dev-server/bin/webpack-dev-server.js')
const configDev = require.resolve('../webpack.config.dev.js')

checkEnvironment().then(() => {
    const result = spawn.sync('node', [webpackDevServer, '--config', configDev, '--progress'], {
        stdio: 'inherit',
    })
    process.exit(result.status)
})
