#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const { parse } = require('react-docgen')
const chokidar = require('chokidar')
const _pickBy = require('lodash/pickBy')
const _mapValues = require('lodash/mapValues')
const { getExampleData, escapeTags } = require('./config/utils.js')

const paths = {
    components: path.join(__dirname, '../packages'),
    output: path.join(__dirname, '../config/'),
}

function writeFile(filepath, content) {
    fs.writeFile(filepath, content, err => {
        err && console.error(err)
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
            props: {},
        }
    } else {
        const content = readFile(path.join(paths.components, componentName, packageJson.src))
        try {
            info = parse(content)
        } catch (e) {
            info = {
                displayName: '',
                description: packageJson.description || '',
                props: {},
            }
        }
    }

    info = {
        ...info,
        description: escapeTags(info.description),
        props: _mapValues(info.props, prop => ({
            ...prop,
            description: prop.description ? escapeTags(prop.description) : '',
        })),
    }

    let documentationComponent
    const documentationFile = path.join(paths.components, componentName, 'Documentation.js')
    if (fs.existsSync(documentationFile)) {
        documentationComponent = `require('../packages/${componentName}/Documentation.js').default`
    }

    return {
        packageName: packageJson.name,
        version: packageJson.version,
        name: componentName,
        github: packageJson.repository,
        displayName: info.displayName,
        description: info.description,
        props: _pickBy(
            info.props || {},
            prop => prop.description && !prop.description.includes('@ignore')
        ),
        examples: getExampleData(path.join(paths.components, componentName)),
        isReact,
        ...(documentationComponent && { documentationComponent }),
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
    if (!fs.existsSync(paths.output)) {
        fs.mkdirSync(paths.output)
    }
    writeFile(path.join(paths.output, 'componentData.js'), content)
}

const enableWatchMode = process.argv.includes('--watch')
if (enableWatchMode) {
    const folders = []
    getDirectories(paths.components).forEach(folder => {
        folders.push(path.join(paths.components, folder, 'src'))
        folders.push(path.join(paths.components, folder, 'examples'))
        folders.push(path.join(paths.components, folder, 'package.json'))
    })

    // Regenerate component metadata when components or examples change.
    chokidar.watch(folders).on('change', generate)
} else {
    // Generate component metadata
    generate()
}
