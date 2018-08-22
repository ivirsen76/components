#!/usr/bin/env babel-node
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const {
    getInitialPackageJson,
    processGitignore,
    processPackagejson,
    getComponentName,
} = require('./config/utils.js')
const spawn = require('cross-spawn')

const currentDir = process.cwd()

function getComponents() {
    const filepath = path.join(currentDir, 'packages')

    return fs
        .readdirSync(filepath)
        .filter(file => fs.statSync(path.join(filepath, file)).isDirectory())
}

const getInitialAnswers = async () => {
    const answers = await inquirer.prompt([
        {
            name: 'name',
            message: 'Package name:',
            validate(value) {
                if (!value) {
                    return 'Name is required'
                }

                if (!/^[a-z0-9-]*$/.test(value)) {
                    return 'Incorrect name'
                }

                if (getComponents().includes(value)) {
                    return 'Name already exists'
                }

                return true
            },
        },
        {
            name: 'description',
            message: 'Description:',
        },
        {
            name: 'isReact',
            message: 'Is it a React component?',
            type: 'confirm',
            default: true,
        },
        {
            name: 'isBuildStep',
            message: 'Do you need to transpile the code?',
            type: 'confirm',
            default: true,
            when(values) {
                return !values.isReact
            },
        },
        {
            name: 'isExamples',
            message: 'Do you need examples?',
            type: 'confirm',
            default: true,
        },
    ])

    return answers
}

const run = async () => {
    const answers = await getInitialAnswers()
    const componentPath = path.join(currentDir, 'packages', answers.name)
    const componentName = `@ieremeev/${answers.name}`
    const reactComponentName = getComponentName(answers.name)

    // Folders
    fs.mkdirSync(componentPath)
    fs.mkdirSync(path.join(componentPath, 'src'))

    // Main file
    let srcContent
    if (answers.isReact) {
        srcContent = `import React from 'react'

/** ${answers.description} */
export default class ${reactComponentName} extends React.Component {
    render() {
        return (
            <div>Content</div>
        )
    }
}
`
    } else {
        srcContent = `/** ${answers.description} */\nexport default 'Hello world'\n`
    }
    fs.writeFileSync(path.join(componentPath, 'src', 'index.js'), srcContent)

    // Examples
    if (answers.isExamples) {
        fs.mkdirSync(path.join(componentPath, 'examples'))
        fs.writeFileSync(
            path.join(componentPath, 'examples', 'default.js'),
            "import React from 'react'\n" +
                `import ${reactComponentName} from '${componentName}'\n\n` +
                `export default () => <${reactComponentName} />\n`
        )
    }

    // Initial package.json
    const packageJson = getInitialPackageJson(componentName, answers)
    fs.writeFileSync(path.join(componentPath, 'package.json'), JSON.stringify(packageJson, null, 4))

    processGitignore(componentPath)
    processPackagejson(componentPath, answers.name)

    spawn.sync('lerna', ['bootstrap'], { stdio: 'inherit' })
}

run().then(() => {
    console.info('Done!')
})
