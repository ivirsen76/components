#!/usr/bin/env node
const spawn = require('cross-spawn')

const webpackDevServer = require.resolve('webpack-dev-server/bin/webpack-dev-server.js')
const config = require.resolve('../webpack.config.dev.js')

spawn.sync(webpackDevServer, ['--config', config, '--progress'], {
    stdio: 'inherit',
})
