#!/usr/bin/env node
const readdir = require('recursive-readdir')
const _includes = require('lodash/includes')
const { getFoldersToBuild, buildFile } = require('./config/utils.js')

console.info('Building files...')

const args = process.argv.slice(2)

const folders = getFoldersToBuild()
folders.forEach(async folder => {
    const files = await readdir(folder)
    files.forEach(src => buildFile({ src, force: _includes(args, '--force') }))
})
