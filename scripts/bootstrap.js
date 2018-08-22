#!/usr/bin/env node
const path = require('path')
const fse = require('fs-extra')
const spawn = require('cross-spawn')

console.info('Updating dependencies...')

const currentTime = Date.now()
const componentsPath = path.join(__dirname, '..', 'packages')
const limit = 60 * 1000 // 60 seconds

// Check if we have package.json files changed recently
const isFilesChanged = () =>
    fse
        .readdirSync(componentsPath)
        .map(folder => path.join(componentsPath, folder, 'package.json'))
        .filter(src => fse.existsSync(src))
        .map(src => currentTime - fse.statSync(src).mtimeMs)
        .some(diff => diff < limit)

if (isFilesChanged()) {
    spawn.sync('lerna', ['bootstrap'])
}
