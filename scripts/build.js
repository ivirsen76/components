#!/usr/bin/env node
const spawn = require('cross-spawn')
const colors = require('colors/safe')

const config = require.resolve('../webpack.config.prod.js')
const rimraf = require.resolve('rimraf/bin.js')
const webpack = require.resolve('webpack/bin/webpack.js')

console.info('Generating minified bundle. This will take a moment...')
spawn.sync(rimraf, ['build'], { stdio: 'inherit' })
spawn.sync(webpack, ['--config', config, '--display', 'minimal'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' },
})
console.info(colors.green('Done!'))
