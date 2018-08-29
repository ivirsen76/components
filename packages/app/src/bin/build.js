#!/usr/bin/env node
const spawn = require('cross-spawn')
const checkEnvironment = require('../checkEnvironment.js')

const webpack = require.resolve('webpack/bin/webpack.js')
const configProd = require.resolve('../webpack.config.prod.js')

checkEnvironment().then(() => {
    const result = spawn.sync('node', [webpack, '--config', configProd], {
        stdio: 'inherit',
    })
    process.exit(result.status)
})
