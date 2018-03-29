#!/usr/bin/env babel-node
import spawn from 'cross-spawn'
import colors from 'colors/safe'
import { checkGitClean } from './config/utils.js'

checkGitClean()

// Check registry
;(() => {
    const result = spawn.sync('npm', ['config', 'get', 'registry'])
    const registry = result.stdout.toString().trim()

    if (registry !== 'https://npm.3cisd.com/') {
        console.error(colors.red('Invalid npm registry. It has to be npm.3cisd.com'))
        process.exit(1)
    }
})()

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

    if (!/Your branch is up-to-date/.test(result) && !/Your branch is ahead/.test(result)) {
        console.error(colors.red('You have to pull all changes from origin/master'))
        process.exit(1)
    }
})()
