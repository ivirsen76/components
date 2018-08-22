#!/usr/bin/env node
const fse = require('fs-extra')
const path = require('path')
const colors = require('colors/safe')

const args = process.argv.slice(2)
if (!args[0]) {
    console.error(colors.red('You have to specify package name'))
    process.exit()
}
const packageName = args[0]

const componentPath = path.join(__dirname, '..', 'packages', packageName)
const src = require.resolve('../src/components/Documentation')
const dest = path.join(componentPath, 'Documentation.js')

if (!fse.existsSync(componentPath)) {
    console.error(colors.red(`There is no package "${packageName}"`))
    process.exit()
}
if (fse.existsSync(dest)) {
    console.error(colors.red('The package already has documentation'))
    process.exit()
}

fse.copy(src, dest)
console.info(colors.green('Done!'))
