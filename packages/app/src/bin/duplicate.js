#!/usr/bin/env node
import spawn from 'cross-spawn'

const webpack = require.resolve('webpack/bin/webpack.js')
const configDev = require.resolve('../webpack.config.dev.js')

console.info('Generating duplicates stat...')

const result = spawn.sync(
    'node',
    [webpack, '--config', configDev, '--progress', '--display', 'minimal'],
    {
        stdio: 'inherit',
        env: { ...process.env, ANALYZE_DUPLICATES: true, BABEL_ENV: 'es' },
    }
)
process.exit(result.status)
