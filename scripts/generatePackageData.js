#!/usr/bin/env babel-node
import fs from 'fs'
import path from 'path'
import { parse } from 'react-docgen'
import chokidar from 'chokidar'
import { getExampleData } from './config/utils.js'

const paths = {
    components: path.join(__dirname, '../packages'),
    output: path.join(__dirname, '../config/', 'componentData.js'),
}

function writeFile(filepath, content) {
    fs.writeFile(filepath, content, err => {
        err ? console.error(err) : console.info('Component data saved.')
    })
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8')
}

function getComponentData(componentName) {
    const packageJson = JSON.parse(
        readFile(path.join(paths.components, componentName, 'package.json'))
    )

    const isReact = !!(packageJson.peerDependencies && packageJson.peerDependencies.react)
    let info
    if (!isReact) {
        info = {
            displayName: '',
            description: packageJson.description,
            props: [],
        }
    } else {
        const content = readFile(path.join(paths.components, componentName, packageJson.src))
        try {
            info = parse(content)
        } catch (e) {
            info = {
                displayName: '',
                description: packageJson.description || '',
                props: [],
            }
        }
    }

    return {
        packageName: packageJson.name,
        version: packageJson.version,
        name: componentName,
        displayName: info.displayName,
        description: info.description,
        props: info.props,
        examples: getExampleData(path.join(paths.components, componentName)),
        isReact,
    }
}

function getDirectories(filepath) {
    return fs
        .readdirSync(filepath)
        .filter(file => fs.statSync(path.join(filepath, file)).isDirectory())
}

function generate() {
    const errors = []
    let componentData = getDirectories(paths.components).map(componentName =>
        getComponentData(componentName)
    )
    let content =
        '/* eslint-disable */\nexport default ' +
        JSON.stringify(errors.length ? errors : componentData, null, 4)
    content = content.replace(/"(require\('[^']*'\).default)"/g, '$1')
    writeFile(paths.output, content)
}

const enableWatchMode = process.argv.includes('--watch')
if (enableWatchMode) {
    // Regenerate component metadata when components or examples change.
    chokidar.watch([paths.components]).on('change', () => {
        generate()
    })
} else {
    // Generate component metadata
    generate()
}
