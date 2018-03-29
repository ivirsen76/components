#!/usr/bin/env babel-node
import spawn from 'cross-spawn'
import _includes from 'lodash/includes'
import checkEnvironment from '../checkEnvironment.js'

const webpack = require.resolve('webpack/bin/webpack.js')
const webpackDevServer = require.resolve('webpack-dev-server/bin/webpack-dev-server.js')
const configDev = require.resolve('../webpack.config.dev.js')
const configProd = require.resolve('../webpack.config.prod.js')
const args = process.argv.slice(2)
const spawnOptions = {
    stdio: 'inherit',
    env: { ...process.env, BABEL_ENV: 'es' },
}

function runProd() {
    const result = spawn.sync('node', [webpack, '--config', configProd, '--progress'], spawnOptions)
    process.exit(result.status)
}

function runDev() {
    if (_includes(args, '--watch')) {
        const result = spawn.sync(
            'node',
            [webpackDevServer, '--config', configDev, '--progress'],
            spawnOptions
        )
        process.exit(result.status)
    } else {
        const result = spawn.sync(
            'node',
            [webpack, '--config', configDev, '--progress'],
            spawnOptions
        )
        process.exit(result.status)
    }
}

checkEnvironment().then(() => {
    if (process.env.NODE_ENV === 'production') {
        runProd()
    } else {
        runDev()
    }
})
