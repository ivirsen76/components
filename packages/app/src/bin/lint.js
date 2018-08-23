#!/usr/bin/env node
const spawn = require('cross-spawn')
const { getStagedJsFiles } = require('../utils.js')
const _includes = require('lodash/includes')

const eslint = require.resolve('eslint/bin/eslint.js')
const args = process.argv.slice(2)

if (_includes(args, '--staged') || _includes(args, '-s')) {
    const stagedFiles = getStagedJsFiles()
    if (stagedFiles.length > 0) {
        const result = spawn.sync('node', [eslint, '-c', 'ieremeev'].concat(stagedFiles), {
            stdio: 'inherit',
        })
        process.exit(result.status)
    }
} else {
    const result = spawn.sync('node', [eslint, '-c', 'ieremeev', 'src'], {
        stdio: 'inherit',
    })
    process.exit(result.status)
}
