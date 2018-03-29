const spawn = require('cross-spawn')

const rimraf = require.resolve('rimraf/bin.js')
spawn.sync(rimraf, ['README.md'], { stdio: 'inherit' })
