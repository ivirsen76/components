#!/usr/bin/env babel-node
import spawn from 'cross-spawn'
import { getStagedJsFiles } from './config/utils.js'
import _includes from 'lodash/includes'

const eslint = require.resolve('eslint/bin/eslint.js')
const eslintignore = require.resolve('./config/.eslintignore')
const prettierignore = eslintignore
const prettier = require.resolve('prettier/bin/prettier.js')
const config = require.resolve('./config/prettierConfig.js')
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
    spawn.sync('node', [
        eslint,
        '-c',
        'ieremeev',
        '--ignore-path',
        eslintignore,
        '--fix',
        'src',
        'packages',
        'scripts',
    ])
    const result = spawn.sync(
        'node',
        [
            prettier,
            '--config',
            config,
            '--ignore-path',
            prettierignore,
            '--write',
            'src/**/*.js',
            'packages/**/*.js',
            'scripts/**/*.js',
        ],
        {
            stdio: 'inherit',
        }
    )
    process.exit(result.status)
}
