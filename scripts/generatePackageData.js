import fs from 'fs'
import path from 'path'
import { parse } from 'react-docgen'
import chokidar from 'chokidar'

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

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(file => fs.statSync(path.join(filepath, file)).isFile())
}

function getExampleData(componentName) {
    function getExampleFiles(examplesPath) {
        let exampleFiles = []
        try {
            exampleFiles = getFiles(examplesPath)
        } catch (error) {
            console.error(`No examples found for ${componentName}.`)
        }
        return exampleFiles
    }

    const examplesPath = path.join(paths.components, componentName, 'examples')
    let examples = getExampleFiles(examplesPath)

    return examples.map(file => {
        let filePath = path.join(examplesPath, file)
        let content = readFile(filePath)
        let info = parse(content)

        return {
            filePath,
            title: info.description,
            code: content.replace(/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, ''),
            component: `require('..${
                filePath.match(/\/packages\/[^/]*\/examples\/.*/)[0]
            }').default`,
        }
    })
}

function getComponentData(componentName) {
    const fileName = require.resolve(path.join(paths.components, componentName))
    const packageJson = require.resolve(path.join(paths.components, componentName, 'package.json'))
    let content = readFile(fileName)
    let info = parse(content)
    return {
        packageName: JSON.parse(readFile(packageJson)).name,
        name: componentName,
        displayName: info.displayName,
        description: info.description,
        props: info.props,
        examples: getExampleData(componentName),
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
}

// Generate component metadata
generate()
