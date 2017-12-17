#!/usr/bin/env node
const spawn = require('cross-spawn')

const rimraf = require.resolve('rimraf/bin.js')
spawn.sync(rimraf, ['dist', 'es'], { stdio: 'inherit' })
