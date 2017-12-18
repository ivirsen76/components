#!/usr/bin/env node
import path from 'path'
import fs from 'fs'
import inquirer from 'inquirer'
import { processGitignore, processPackagejson } from './setupPackages.js'

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
    ])

    return answers
}

const run = async () => {
    const answers = await getInitialAnswers()
    const componentPath = path.join(currentDir, 'packages', answers.name)
    const componentName = `@ieremeev/${answers.name}`

    // Folders
    fs.mkdirSync(componentPath)
    fs.mkdirSync(path.join(componentPath, 'src'))

    // Main file
    fs.writeFileSync(
        path.join(componentPath, 'src', 'index.js'),
        `/** ${answers.description} */\nexport default 'Hello world'\n`
    )

    // Initial package.json
    const packageJson = {
        name: componentName,
        version: '1.0.0',
        description: answers.description,
        src: 'src/index.js',
        main: 'dist/index.js',
        module: 'es/index.js',
        author: 'Igor Eremeev <ivirsen@gmail.com>',
        license: 'MIT',
        peerDependencies: { react: '14' },
        dependencies: {},
    }
    fs.writeFileSync(path.join(componentPath, 'package.json'), JSON.stringify(packageJson, null, 4))

    processGitignore(componentPath)
    processPackagejson(componentPath, answers.name)
}

run()
