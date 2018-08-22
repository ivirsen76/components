#!/usr/bin/env node
const fse = require('fs-extra')
const chokidar = require('chokidar')
const { getFoldersToBuild, buildFile } = require('./config/utils.js')

console.info('Watching for changes...')

const deleteFile = src => {
    const dest = src.replace('/src/', '/es/')
    const distDest = src.replace('/src/', '/dist/')
    fse.remove(dest)
    fse.remove(distDest)
}

const srcFolders = getFoldersToBuild()

const watcher = chokidar.watch(srcFolders)
watcher.on('change', src => buildFile({ src }))
watcher.on('unlink', deleteFile)
watcher.on('ready', () => {
    watcher.on('add', src => buildFile({ src }))
})
