#!/usr/bin/env node
const spawn = require('cross-spawn')
const { getStagedJsFiles, getModifiedJsFiles } = require('./config/utils.js')
const _includes = require('lodash/includes')
const _difference = require('lodash/difference')

const eslint = require.resolve('eslint/bin/eslint.js')
const eslintignore = require.resolve('../.eslintignore')
const prettierignore = eslintignore
const prettier = require.resolve('prettier/bin/prettier.js')
const config = require.resolve('./config/prettierConfig.js')
const args = process.argv.slice(2)

if (_includes(args, '--staged') || _includes(args, '-s')) {
    // don't format files that are both in staged and modified areas
    const affectedFiles = _difference(getStagedJsFiles(), getModifiedJsFiles())
    if (affectedFiles.length <= 0) {
        process.exit()
    }

    spawn.sync('node', [eslint, '-c', 'ieremeev', '--fix'].concat(affectedFiles))
    spawn.sync('node', [prettier, '--config', config, '--write'].concat(affectedFiles))
    spawn.sync('git', ['add'].concat(affectedFiles))
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
