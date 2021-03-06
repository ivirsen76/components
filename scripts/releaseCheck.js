#!/usr/bin/env node
const spawn = require('cross-spawn')
const colors = require('colors/safe')
const { checkGitClean } = require('./config/utils.js')

console.info('Checking environment...')

checkGitClean()

// Check master branch
;(() => {
    const result = spawn.sync('git', ['branch']).stdout.toString()

    if (!/\* master/.test(result)) {
        console.error(colors.red('You have to be on master branch'))
        process.exit(1)
    }
})()

// Check that branch is up-to-date
;(() => {
    spawn.sync('git', ['fetch'])

    const result = spawn.sync('git', ['status']).stdout.toString()

    if (!/Your branch is up/.test(result) && !/Your branch is ahead/.test(result)) {
        console.error(colors.red('You have to pull all changes from origin/master'))
        process.exit(1)
    }
})()

// Check if we have updated packages
;(() => {
    const result = spawn.sync('lerna', ['updated', '--json']).stdout.toString()
    if (!result) {
        console.error(colors.red('You have no packages to publish'))
        process.exit(1)
    }
})()
