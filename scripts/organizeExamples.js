#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('colors/safe')

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(file => fs.statSync(path.join(filepath, file)).isFile())
}

function getTitleFromFilename(string) {
    string = string.replace(/([^/]+).js$/, '$1').replace(/_/g, ' ')
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const args = process.argv.slice(2)
if (!args[0]) {
    console.error(colors.red('You have to specify package name'))
    process.exit()
}
const packageName = args[0]

const componentPath = path.join(__dirname, '..', 'packages', packageName)
const examplesPath = path.join(componentPath, 'examples')
const configFile = path.join(examplesPath, 'config.json')

if (!fs.existsSync(componentPath)) {
    console.error(colors.red(`There is no package "${packageName}"`))
    process.exit()
}
if (!fs.existsSync(examplesPath)) {
    console.error(colors.red("The package doesn't have any examples"))
    process.exit()
}

let result = []
if (fs.existsSync(configFile)) {
    result = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
}
const existingFiles = result.map(o => o.file)

const examples = getFiles(examplesPath)
    .filter(file => !/^_/.test(file) && /\.js$/.test(file))
    .filter(file => !existingFiles.includes(file))
    .map(file => ({
        title: getTitleFromFilename(file),
        file,
    }))
    .sort((a, b) => a.file > b.file)

if (examples.length === 0) {
    console.info(colors.green('Done without updates!'))
    process.exit()
}

result = [...result, ...examples]
fs.writeFileSync(configFile, JSON.stringify(result, null, 4))

console.info(colors.green(`Done! Added ${examples.length} examples`))
