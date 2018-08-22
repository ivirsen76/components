#!/usr/bin/env node
const readdir = require('recursive-readdir')
const { getFoldersToBuild, buildFile } = require('./config/utils.js')
const _includes = require('lodash/includes')

console.info('Building files...')

const args = process.argv.slice(2)

const folders = getFoldersToBuild()
folders.forEach(async folder => {
    const files = await readdir(folder)
    files.forEach(src => buildFile({ src, force: _includes(args, '--force') }))
})
