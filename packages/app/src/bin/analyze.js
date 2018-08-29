#!/usr/bin/env node
const spawn = require('cross-spawn')
const _includes = require('lodash/includes')

const webpack = require.resolve('webpack/bin/webpack.js')
const configDev = require.resolve('../webpack.config.dev.js')
const configProd = require.resolve('../webpack.config.prod.js')
const args = process.argv.slice(2)
const spawnOptions = {
    stdio: 'inherit',
    env: { ...process.env, ANALYZE_BUNDLE: true },
}

console.info('Generating webpack stat. It will take up to several minutes')
console.info('After finishing the browser window will be opened')

if (_includes(args, '--dev')) {
    // Generate simple stat without uglyfying
    // It will be much faster
    const result = spawn.sync(
        'node',
        [webpack, '--config', configDev, '--progress', '--display', 'errors-only'],
        spawnOptions
    )
    process.exit(result.status)
} else {
    // Generate stat with real gzip information
    const result = spawn.sync(
        'node',
        [webpack, '--config', configProd, '--progress', '--display', 'errors-only'],
        spawnOptions
    )
    process.exit(result.status)
}
