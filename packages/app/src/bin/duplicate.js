#!/usr/bin/env node
const spawn = require('cross-spawn')

const webpack = require.resolve('webpack/bin/webpack.js')
const configDev = require.resolve('../webpack.config.dev.js')

console.info('Generating duplicates stat...')

const result = spawn.sync(
    'node',
    [webpack, '--config', configDev, '--progress', '--display', 'minimal'],
    {
        stdio: 'inherit',
        env: { ...process.env, ANALYZE_DUPLICATES: true },
    }
)
process.exit(result.status)
