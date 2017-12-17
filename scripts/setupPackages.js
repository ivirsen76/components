#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import _union from 'lodash/union'
import _isEqual from 'lodash/isEqual'
import _pick from 'lodash/pick'
import _omit from 'lodash/omit'

const componentsPath = path.join(__dirname, '../packages')

function getDirectories(filepath) {
    return fs
        .readdirSync(filepath)
        .filter(file => fs.statSync(path.join(filepath, file)).isDirectory())
}

function adjustIgnoreFile(filename, add = [], remove = []) {
    let initialArray = []
    if (fs.existsSync(filename)) {
        initialArray = fs
            .readFileSync(filename)
            .toString()
            .split('\n')
            .filter(command => command !== '')
    }

    const addArray = typeof add === 'string' ? [add] : add
    const removeArray = typeof remove === 'string' ? [remove] : remove
    const resultArray = _union(initialArray, addArray).filter(item => !removeArray.includes(item))

    if (_isEqual(initialArray, resultArray)) {
        return
    }

    fs.writeFileSync(filename, resultArray.join('\n') + '\n')
}

function processGitignore(filepath) {
    adjustIgnoreFile(path.join(filepath, '.gitignore'), ['README.md', 'node_modules', 'dist', 'es'])
}

function processPackagejson(filepath, componentName) {
    const filename = path.join(filepath, 'package.json')
    let obj = JSON.parse(fs.readFileSync(filename))

    // fix main
    if (obj.main) {
        obj.main = obj.main.replace(/^[^/]+\//, 'dist/')

        // Set up module and src
        obj.module = obj.main.replace(/^dist\//, 'es/')
        obj.src = obj.main.replace(/^dist\//, 'src/')
    }

    // fix license
    obj.license = 'MIT'

    // remove scripts
    obj.scripts = {
        build: 'node ../../scripts/build.js',
        'build:watch': 'npm run build -- --watch',
        readme: 'node ../../scripts/generateReadme.js',
        prepublishOnly: 'npm run readme && npm run build',
        postpublish: 'node ../../scripts/clean.js',
    }

    obj.files = ['src', 'dist', 'es']

    obj.repository = `https://github.com/ivirsen76/components/tree/master/packages/${componentName}`

    // Remove unnessessary keys
    delete obj.babel
    delete obj.devDependencies

    // fix react peer dependency
    if (obj.peerDependencies) {
        if (obj.peerDependencies.react) {
            obj.peerDependencies.react = '^15.0.0 || ^16.0.0'
        }
        if (obj.peerDependencies['react-dom']) {
            obj.peerDependencies['react-dom'] = '^15.0.0 || ^16.0.0'
        }
    }

    // Sort fields in a right way
    const firstGroup = [
        'name',
        'version',
        'description',
        'src',
        'main',
        'module',
        'repository',
        'author',
        'license',
        'files',
        'scripts',
    ]
    const lastGroup = ['peerDependencies', 'dependencies']
    obj = Object.assign(
        _pick(obj, firstGroup),
        _omit(obj, [...firstGroup, ...lastGroup]),
        _pick(obj, lastGroup)
    )

    fs.writeFileSync(filename, JSON.stringify(obj, null, 4) + '\n')
}

getDirectories(componentsPath).forEach(componentName => {
    const componentPath = path.join(componentsPath, componentName)
    processGitignore(componentPath)
    processPackagejson(componentPath, componentName)
})