import spawn from 'cross-spawn'
import path from 'path'
import fs from 'fs'
import { parse } from 'react-docgen'
import _union from 'lodash/union'
import _isEqual from 'lodash/isEqual'
import _pick from 'lodash/pick'
import _omit from 'lodash/omit'

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(file => fs.statSync(path.join(filepath, file)).isFile())
}

export const getStagedJsFiles = () =>
    spawn
        .sync('git', ['diff', '--cached', '--name-only'])
        .stdout.toString()
        .trim()
        .split('\n')
        .filter(file => /\.js$/.test(file))

export const getExampleData = componentPath => {
    function getExampleFiles(examplesPath) {
        function getTitleFromFilename(string) {
            string = string.replace(/.*\/([^/]+).js$/, '$1').replace(/_/g, ' ')
            return string.charAt(0).toUpperCase() + string.slice(1)
        }

        const indexFile = path.join(examplesPath, 'index.js')
        let result = []
        if (fs.existsSync(indexFile)) {
            delete require.cache[require.resolve(indexFile)]
            // eslint-disable-next-line global-require, import/no-dynamic-require
            const files = require(indexFile).default

            result = files.map(o => ({
                title: o.title || getTitleFromFilename(o.file),
                file: o.file,
            }))
        }

        const filesFromIndex = result.map(o => o.file)
        const otherFiles = getFiles(examplesPath)
            .filter(file => file !== 'index.js' && file !== 'index.test.js')
            .map(file => path.join(examplesPath, file))
            .filter(file => !filesFromIndex.includes(file))
            .map(file => ({
                title: getTitleFromFilename(file),
                file,
            }))

        return result.concat(otherFiles)
    }

    try {
        const examplesPath = path.join(componentPath, 'examples')
        const examples = getExampleFiles(examplesPath)

        return examples.map(example => {
            const filePath = example.file
            const content = fs.readFileSync(filePath, 'utf-8')
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
    } catch (e) {
        return []
    }
}

export const getInitialPackageJson = (componentName, answers) => {
    const result = {
        name: componentName,
        version: '1.0.0',
        description: answers.description,
        author: 'Igor Eremeev <ivirsen@gmail.com>',
        license: 'MIT',
        dependencies: {},
    }

    if (answers.isReact) {
        result.peerDependencies = { react: '14' }
    }
    if (answers.isReact || answers.isBuildStep) {
        result.src = 'src/index.js'
        result.main = 'dist/index.js'
        result.module = 'es/index.js'
    }
    if (!answers.isReact && !answers.isBuildStep) {
        result.ieremeev = { build: false }
        result.main = 'src/index.js'
    }

    return result
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

export const processGitignore = filepath => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(filepath, 'package.json')))
    const config = {
        build: true,
        ...packageJson.ieremeev,
    }

    if (config.build) {
        adjustIgnoreFile(path.join(filepath, '.gitignore'), [
            'README.md',
            'node_modules',
            'dist',
            'es',
        ])
    }
}

export const processPackagejson = (filepath, componentName) => {
    const filename = path.join(filepath, 'package.json')
    let obj = JSON.parse(fs.readFileSync(filename))

    const config = {
        build: true,
        ...obj.ieremeev,
    }

    // Remove unnessessary keys
    delete obj.babel
    delete obj.devDependencies

    if (config.build) {
        // fix main
        if (obj.main) {
            obj.main = obj.main.replace(/^[^/]+\//, 'dist/')

            // Set up module and src
            obj.module = obj.main.replace(/^dist\//, 'es/')
            obj.src = obj.main.replace(/^dist\//, 'src/')

            // Set up scripts
            obj.scripts = {
                babel: '../../node_modules/.bin/babel-node',
                build: 'npm run babel -- ../../scripts/package/build.js',
                'build:watch': 'npm run build -- --watch',
                readme: 'npm run babel -- ../../scripts/package/readme.js',
                prepublishOnly: 'npm run readme && npm run build',
                postpublish: 'npm run babel -- ../../scripts/package/clean.js',
            }
        }

        obj.files = ['src', 'dist', 'es']

        // fix react peer dependency
        obj.peerDependencies = {
            ...obj.peerDependencies,
            [obj.name]: '*', // add itself to fix eslint issues for examples
        }
        if (obj.peerDependencies.react) {
            obj.peerDependencies.react = '^15.0.0 || ^16.0.0'
        }
        if (obj.peerDependencies['react-dom']) {
            obj.peerDependencies['react-dom'] = '^15.0.0 || ^16.0.0'
        }
    }

    obj.license = 'MIT'
    obj.repository = `https://github.com/ivirsen76/components/tree/master/packages/${componentName}`
    obj.author = 'Igor Eremeev <ivirsen@gmail.com>'

    // Sort fields in a right way
    const firstGroup = [
        'name',
        'version',
        'description',
        'src',
        'main',
        'module',
        'author',
        'repository',
        'license',
        'files',
        'scripts',
        'ieremeev',
    ]
    const lastGroup = ['peerDependencies', 'dependencies']
    obj = Object.assign(
        _pick(obj, firstGroup),
        _omit(obj, [...firstGroup, ...lastGroup]),
        _pick(obj, lastGroup)
    )

    const content = JSON.stringify(obj, null, 4) + '\n'
    fs.writeFileSync(filename, content)
}

export const processExamplesTest = filepath => {
    const examplesFolder = path.join(filepath, 'examples')
    if (fs.existsSync(examplesFolder)) {
        const testFile = path.join(examplesFolder, 'index.test.js')
        const content = "import test from '../../../scripts/testExamples.js'\n\ntest(__dirname)\n"

        fs.writeFileSync(testFile, content)
    }
}
