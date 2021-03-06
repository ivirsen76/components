#!/usr/bin/env node
const spawn = require('cross-spawn')
const _includes = require('lodash/includes')
const { getStagedJsFiles } = require('../utils.js')

const eslint = require.resolve('eslint/bin/eslint.js')
const prettier = require.resolve('prettier/bin/prettier.js')
const config = require.resolve('../prettierConfig.js')
const args = process.argv.slice(2)

if (_includes(args, '--staged') || _includes(args, '-s')) {
    const stagedFiles = getStagedJsFiles()
    if (stagedFiles.length <= 0) {
        process.exit()
    }

    spawn.sync('node', [eslint, '-c', 'ieremeev', '--fix'].concat(stagedFiles))
    spawn.sync('node', [prettier, '--config', config, '--write'].concat(stagedFiles))
    spawn.sync('git', ['add'].concat(stagedFiles))
    process.exit()
} else {
    spawn.sync('node', [eslint, '-c', 'ieremeev', '--fix', 'src/**/*.js'])
    const result = spawn.sync('node', [prettier, '--config', config, '--write', 'src/**/*.js'], {
        stdio: 'inherit',
    })
    process.exit(result.status)
}
