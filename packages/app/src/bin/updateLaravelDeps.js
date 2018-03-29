#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import spawn from 'cross-spawn'
import _forEach from 'lodash/forEach'

const currentDir = process.cwd()

const getDeps = () => {
    let deps = {}
    const composerFiles = []
    const vendorDir = path.join(currentDir, 'vendor', 'cccisd')

    if (!fs.existsSync(vendorDir)) {
        return deps
    }

    const files = fs.readdirSync(vendorDir)
    files.forEach(file => {
        const filename = path.join(vendorDir, file, 'composer.json')
        composerFiles.push(JSON.parse(fs.readFileSync(filename)))
    })

    composerFiles.forEach(obj => {
        if (obj.extra && obj.extra.npmDependencies) {
            deps = { ...deps, ...obj.extra.npmDependencies }
        }
    })

    return deps
}

const installUpdatedDeps = deps => {
    const filename = path.join(currentDir, 'package.json')
    const oldDeps = JSON.parse(fs.readFileSync(filename)).dependencies
    const newDeps = []
    _forEach(deps, (version, key) => {
        if (oldDeps[key] === version) {
            return
        }

        newDeps.push(`${key}@${version}`)
    })

    if (newDeps.length === 0) {
        return
    }

    const result = spawn.sync(
        'npm',
        ['install', '--save-exact', '--ignore-scripts'].concat(newDeps),
        {
            stdio: 'inherit',
        }
    )
    process.exit(result.status)
}

installUpdatedDeps(getDeps())
