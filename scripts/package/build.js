#!/usr/bin/env node
const spawn = require('cross-spawn')

const rimraf = require.resolve('rimraf/bin.js')
const babel = require.resolve('@babel/cli/bin/babel.js')
const args = process.argv.slice(2)

spawn.sync(rimraf, ['dist', 'es'], { stdio: 'inherit' })

const buildCommonjs = spawn(
    babel,
    ['src', '--out-dir', 'dist', '--copy-files', '--presets=ieremeev', '--no-babelrc'].concat(args),
    { stdio: 'inherit' }
)
const buildEs = spawn(
    babel,
    ['src', '--out-dir', 'es', '--copy-files', '--presets=ieremeev', '--no-babelrc'].concat(args),
    {
        stdio: 'inherit',
        env: { ...process.env, BABEL_PRESET_IEREMEEV: JSON.stringify({ modules: false }) },
    }
)

process.on('exit', () => {
    buildCommonjs.kill()
    buildEs.kill()
})
