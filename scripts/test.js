#!/usr/bin/env babel-node
process.env.NODE_ENV = 'test'

const spawn = require('cross-spawn')
const { getStagedJsFiles } = require('./config/utils.js')
const config = require('./config/jestConfig.js')
const _includes = require('lodash/includes')

const jest = require.resolve('jest/bin/jest.js')
const args = process.argv.slice(2)

if (_includes(args, '--staged') || _includes(args, '-s')) {
    let result

    // Get staged files
    const stagedFiles = getStagedJsFiles()
    if (stagedFiles.length <= 0) {
        process.exit()
    }

    // Get related tests
    result = spawn.sync(
        'node',
        [
            jest,
            '--config',
            JSON.stringify(config),
            '--listTests',
            '--json',
            '--findRelatedTests',
        ].concat(stagedFiles)
    )
    const testFiles = JSON.parse(result.stdout.toString())
    if (testFiles.length <= 0) {
        process.exit()
    }

    result = spawn.sync(
        'node',
        [jest, '--config', JSON.stringify(config), '--silent'].concat(testFiles),
        {
            stdio: 'inherit',
        }
    )
    process.exit(result.status)
} else {
    const result = spawn.sync('node', [jest, '--config', JSON.stringify(config)].concat(args), {
        stdio: 'inherit',
    })
    process.exit(result.status)
}
