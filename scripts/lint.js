#!/usr/bin/env node
const spawn = require('cross-spawn')
const { getStagedJsFiles, getPublishingFolders } = require('./config/utils.js')
const _includes = require('lodash/includes')

console.info('Linting files...')

const eslint = require.resolve('eslint/bin/eslint.js')
const eslintignore = require.resolve('./config/.eslintignore')
const args = process.argv.slice(2)

if (_includes(args, '--staged') || _includes(args, '-s')) {
    const stagedFiles = getStagedJsFiles()
    if (stagedFiles.length <= 0) {
        process.exit()
    }

    const result = spawn.sync('node', [eslint, '-c', 'ieremeev'].concat(stagedFiles), {
        stdio: 'inherit',
    })
    process.exit(result.status)
} else if (_includes(args, '--publishing') || _includes(args, '-p')) {
    const folders = getPublishingFolders()
    if (folders.length <= 0) {
        process.exit()
    }

    const result = spawn.sync('node', [eslint, '-c', 'ieremeev'].concat(folders), {
        stdio: 'inherit',
    })
    process.exit(result.status)
} else {
    const result = spawn.sync(
        'node',
        [eslint, '-c', 'ieremeev', '--ignore-path', eslintignore, 'src', 'packages', 'scripts'],
        {
            stdio: 'inherit',
        }
    )
    process.exit(result.status)
}
