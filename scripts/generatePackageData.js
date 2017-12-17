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

function getExampleData(componentName) {
    function getExampleFiles(examplesPath) {
        function getTitleFromFilename(string) {
            string = string.replace(/.*\/([^/]+).js$/, '$1').replace(/_/g, ' ')
            return string.charAt(0).toUpperCase() + string.slice(1)
        }

        const indexFile = path.join(examplesPath, 'index.js')
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const files = require(indexFile).default

        return files.map(o => ({
            title: o.title || getTitleFromFilename(o.file),
            file: o.file,
        }))
    }

    const examplesPath = path.join(paths.components, componentName, 'examples')
    const examples = getExampleFiles(examplesPath)

    return examples.map(example => {
        const filePath = example.file
        const content = readFile(filePath)
        const info = parse(content)

        return {
            filePath,
            title: example.title,
            description: info.description,
            code: content.replace(/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, ''),
            component: `require('..${
                filePath.match(/\/packages\/[^/]*\/examples\/.*/)[0]
            }').default`,
        }
    })
}

function getComponentData(componentName) {
    const packageJson = JSON.parse(
        readFile(path.join(paths.components, componentName, 'package.json'))
    )
    const content = readFile(path.join(paths.components, componentName, packageJson.src))
    const info = parse(content)
    return {
        packageName: packageJson.name,
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
} else {
    // Generate component metadata
    generate()
}
