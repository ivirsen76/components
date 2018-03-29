import spawn from 'cross-spawn'
import path from 'path'
import fs from 'fs'
import fse from 'fs-extra'
import { parse } from 'react-docgen'
import _union from 'lodash/union'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _pick from 'lodash/pick'
import _omit from 'lodash/omit'
import colors from 'colors/safe'

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

export const checkGitClean = () => {
    const result = spawn.sync('git', ['status', '--porcelain'])
    if (result.stdout.toString().trim() !== '') {
        console.error(colors.red('You have to commit changes'))
        process.exit(1)
    }
}

export const getExampleData = componentPath => {
    function getExampleFiles(examplesPath) {
        function getTitleFromFilename(string) {
            string = string.replace(/.*\/([^/]+).js$/, '$1').replace(/_/g, ' ')
            return string.charAt(0).toUpperCase() + string.slice(1)
        }

        const configFile = path.join(examplesPath, 'config.json')
        let result = []
        if (fs.existsSync(configFile)) {
            result = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
                .map(o => {
                    const fullPath = path.join(examplesPath, o.file)
                    return {
                        title: o.title || getTitleFromFilename(fullPath),
                        file: fullPath,
                        only: !!o.only,
                    }
                })
                .filter(o => fs.existsSync(o.file))
        }

        const onlyExample = result.find(o => o.only)
        if (onlyExample) {
            return [onlyExample]
        }

        const filesFromConfig = result.map(o => o.file)
        const otherFiles = getFiles(examplesPath)
            .filter(file => !/^_/.test(file) && /\.js$/.test(file))
            .map(file => path.join(examplesPath, file))
            .filter(file => !filesFromConfig.includes(file))
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

export const getAuthor = () => {
    const result = spawn.sync('git', ['config', 'user.name'])
    return result.stdout.toString().trim()
}

export const getInitialPackageJson = (componentName, answers) => {
    const result = {
        name: componentName,
        version: '1.0.0',
        description: answers.description,
        author: getAuthor(),
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
    if (
        _isEmpty(obj.devDependencies) ||
        obj.devDependencies['ieremeev-package'] ||
        obj.devDependencies['babel-cli']
    ) {
        delete obj.devDependencies
    }

    if (config.build) {
        // fix main
        if (obj.main) {
            obj.main = obj.main.replace(/^[^/]+\//, 'dist/')

            // Set up module and src
            obj.module = obj.main.replace(/^dist\//, 'es/')
            obj.src = obj.main.replace(/^dist\//, 'src/')
        }

        // Set up scripts
        obj.scripts = {
            babel: '../../node_modules/.bin/babel-node',
            build: 'npm run babel -- ../../scripts/package/build.js',
            readme: 'npm run babel -- ../../scripts/package/readme.js',
            prepublishOnly: 'npm run readme && npm run build',
            postpublish: 'npm run babel -- ../../scripts/package/clean.js',
        }

        obj.files = ['src', 'dist', 'es']

        // fix react peer dependency
        obj.peerDependencies = {
            ...obj.peerDependencies,
            [obj.name]: '*', // add itself to fix eslint issues for examples
        }
        if (obj.peerDependencies.react) {
            obj.peerDependencies.react = '^16.0.0'
        }
        if (obj.peerDependencies['react-dom']) {
            obj.peerDependencies['react-dom'] = '^16.0.0'
        }
    }

    obj.license = 'MIT'
    obj.repository = `https://github.com/ivirsen76/components/tree/master/packages/${componentName}`
    obj.author = getAuthor()

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

export const getComponentName = string =>
    string
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')

export const writeOnlyIfChanged = (dest, content) => {
    if (fs.existsSync(dest)) {
        const oldContent = fs.readFileSync(dest, 'utf8')
        if (oldContent === content) {
            return null
        }
    }

    return fse.outputFile(dest, content)
}

export const copyOnlyIfChanged = (src, dest) => {
    if (fs.existsSync(dest)) {
        const srcBuf = fs.readFileSync(src)
        const destBuf = fs.readFileSync(dest)

        if (srcBuf.equals(destBuf)) {
            return null
        }

        return fse.outputFile(dest, srcBuf)
    }

    return fse.copy(src, dest)
}
