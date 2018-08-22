#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { processGitignore, processPackagejson, processReadme } = require('./config/utils.js')
const colors = require('colors/safe')
const rimraf = require('rimraf')

const componentsPath = path.join(__dirname, '../packages')

function getDirectories(filepath) {
    return fs
        .readdirSync(filepath)
        .filter(file => fs.statSync(path.join(filepath, file)).isDirectory())
}

getDirectories(componentsPath).forEach(componentName => {
    const componentPath = path.join(componentsPath, componentName)

    // Remove unnessessary files
    let isImportedPackage = false
    const removedFiles = [
        path.join(componentPath, '.npmignore'),
        path.join(componentPath, '.eslintrc'),
        path.join(componentPath, '.npmrc'),
        path.join(componentPath, '.prettierrc'),
        path.join(componentPath, '.git'),
        path.join(componentPath, 'yarn.lock'),
        path.join(componentPath, 'stories', '__snapshots__'),
    ]
    removedFiles.forEach(file => {
        if (fs.existsSync(file)) {
            isImportedPackage = true
            rimraf.sync(file)
        }
    })

    if (isImportedPackage) {
        // Remove node_modules, dist and es folders
        rimraf.sync(path.join(componentPath, 'node_modules'))
        rimraf.sync(path.join(componentPath, 'dist'))
        rimraf.sync(path.join(componentPath, 'es'))

        // Rename README.md if it's an imported package
        const readme = path.join(componentPath, 'README.md')
        const readmeBackup = path.join(componentPath, 'READMEbackup.md')
        if (fs.existsSync(readme) && !fs.existsSync(readmeBackup)) {
            fs.renameSync(readme, readmeBackup)
        }
    }

    processGitignore(componentPath)
    processPackagejson(componentPath, componentName)
    processReadme(componentPath)
})

console.info(colors.green('Done!'))
