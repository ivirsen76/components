import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { parse } from 'react-docgen'
import chokidar from 'chokidar'

const paths = {
    components: path.join(__dirname, '../packages'),
    output: path.join(__dirname, '../config/', 'componentData.js'),
}

const enableWatchMode = process.argv.slice(2) === '--watch'
if (enableWatchMode) {
    // Regenerate component metadata when components or examples change.
    chokidar.watch([paths.examples, paths.components]).on('change', function(event, path) {
        generate(paths)
    })
} else {
    // Generate component metadata
    generate(paths)
}

function generate(paths) {
    var errors = []
    var componentData = getDirectories(paths.components).map(function(componentName) {
        try {
            return getComponentData(paths, componentName)
        } catch (error) {
            errors.push(
                'An error occurred while attempting to generate metadata for ' +
                    componentName +
                    '. ' +
                    error
            )
        }
    })
    writeFile(
        paths.output,
        '/* eslint-disable */\nexport default ' +
            JSON.stringify(errors.length ? errors : componentData, null, 4)
    )
}

function getComponentData(paths, componentName) {
    const fileName = require.resolve(path.join(paths.components, componentName))
    var content = readFile(fileName)
    var info = parse(content)
    return {
        name: componentName,
        displayName: info.displayName,
        description: info.description,
        props: info.props,
        examples: getExampleData(componentName),
    }
}

function getExampleData(componentName) {
    const examplesPath = path.join(paths.components, componentName, 'examples')
    var examples = getExampleFiles(examplesPath)
    return examples.map(function(file) {
        var filePath = path.join(examplesPath, file)
        var content = readFile(filePath)
        var info = parse(content)
        return {
            // By convention, component name should match the filename.
            // So remove the .js extension to get the component name.
            filePath,
            description: info.description,
            code: content,
        }
    })
}

function getExampleFiles(examplesPath) {
    var exampleFiles = []
    try {
        exampleFiles = getFiles(examplesPath)
    } catch (error) {
        console.log(chalk.red(`No examples found for ${componentName}.`))
    }
    return exampleFiles
}

function getDirectories(filepath) {
    return fs.readdirSync(filepath).filter(function(file) {
        return fs.statSync(path.join(filepath, file)).isDirectory()
    })
}

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(function(file) {
        return fs.statSync(path.join(filepath, file)).isFile()
    })
}

function writeFile(filepath, content) {
    fs.writeFile(filepath, content, function(err) {
        err ? console.log(chalk.red(err)) : console.log(chalk.green('Component data saved.'))
    })
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8')
}
