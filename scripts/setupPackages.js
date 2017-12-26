#!/usr/bin/env babel-node
import path from 'path'
import fs from 'fs'
import { processGitignore, processPackagejson, processExamplesTest } from './config/utils.js'

const componentsPath = path.join(__dirname, '../packages')

function getDirectories(filepath) {
    return fs
        .readdirSync(filepath)
        .filter(file => fs.statSync(path.join(filepath, file)).isDirectory())
}

getDirectories(componentsPath).forEach(componentName => {
    const componentPath = path.join(componentsPath, componentName)

    processGitignore(componentPath)
    processPackagejson(componentPath, componentName)
    processExamplesTest(componentPath)
})
