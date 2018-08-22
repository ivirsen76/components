const spawn = require('cross-spawn')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const { parse } = require('react-docgen')
const _union = require('lodash/union')
const _isEqual = require('lodash/isEqual')
const _isEmpty = require('lodash/isEmpty')
const _pick = require('lodash/pick')
const _omit = require('lodash/omit')
const colors = require('colors/safe')
const escapeHtml = require('escape-html')
const { transformFile } = require('babel-core')

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(file => fs.statSync(path.join(filepath, file)).isFile())
}

const packagesGitPath = 'https://github.com/ivirsen76/components/tree/master/packages'
const componentsPath = path.join(__dirname, '..', '..', 'packages')

/** Escape HTML tags exect some */
const escapeTags = string => {
    const allowedTags = ['p', 'br', 'pre', 'b', 'i', 'li', 'ul', 'ol']
    const tagList = allowedTags.join('|')

    let result = string
    result = result.replace(new RegExp(`<(/?(${tagList}))/?>`, 'gi'), '###$1###')
    result = escapeHtml(result)
    result = result.replace(new RegExp(`###(/?(${tagList}))###`, 'gi'), '<$1>')

    return result
}

const getStagedJsFiles = () =>
    spawn
        .sync('git', ['diff', '--cached', '--name-only'])
        .stdout.toString()
        .trim()
        .split('\n')
        .filter(file => /\.js$/.test(file))

const getModifiedJsFiles = () =>
    spawn
        .sync('git', ['diff', '--name-only'])
        .stdout.toString()
        .trim()
        .split('\n')
        .filter(file => /\.js$/.test(file))

const getPublishingFolders = () => {
    const json = spawn.sync('lerna', ['updated', '--json']).stdout.toString()
    if (!json) {
        return []
    }

    return JSON.parse(json).map(
        component => componentsPath + '/' + component.name.replace('@ieremeev/', '') + '/src'
    )
}

const checkGitClean = () => {
    const result = spawn.sync('git', ['status', '--porcelain'])
    if (result.stdout.toString().trim() !== '') {
        console.error(colors.red('You have to commit changes'))
        process.exit(1)
    }
}

const getExampleData = componentPath => {
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

        return result.concat(otherFiles).map(example => ({
            ...example,
            filename: path.basename(example.file),
        }))
    }

    try {
        const examplesPath = path.join(componentPath, 'examples')
        const examples = getExampleFiles(examplesPath)
        const componentName = path.basename(componentPath)

        return examples.map(example => {
            const filePath = example.file
            const content = fs.readFileSync(filePath, 'utf-8')
            const info = parse(content)

            return {
                sourceUrl: `${packagesGitPath}/${componentName}/examples/${example.filename}`,
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

const getAuthor = () => {
    const result = spawn.sync('git', ['config', 'user.name'])
    return result.stdout.toString().trim()
}

const getInitialPackageJson = (componentName, answers) => {
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

const processGitignore = filepath => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(filepath, 'package.json')))
    const config = {
        build: true,
        ...packageJson.ieremeev,
    }

    if (config.build) {
        adjustIgnoreFile(
            path.join(filepath, '.gitignore'),
            ['node_modules', 'dist', 'es', '/*.log'],
            ['README.md']
        )
    }
}

const processPackagejson = (filepath, componentName) => {
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
            build: '../../scripts/package/build.js',
            prepublishOnly: 'npm run build',
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
    obj.repository = `${packagesGitPath}/${componentName}`

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

const processReadme = filepath => {
    const filename = path.join(filepath, 'README.md')
    const packageJson = JSON.parse(fs.readFileSync(path.join(filepath, 'package.json'), 'utf-8'))
    const simplePackageName = packageJson.name.replace('@ieremeev/', '')
    const content = `# ${packageJson.name}\n
[Documentation](http://demo.igor-eremeev.com/components/${simplePackageName})`

    fs.writeFileSync(filename, content)
}

const getComponentName = string =>
    string
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')

const getFoldersToBuild = () =>
    fse
        .readdirSync(componentsPath)
        .filter(folder => fse.existsSync(path.join(componentsPath, folder, 'package.json')))
        .filter(folder => {
            const packageJson = JSON.parse(
                fse.readFileSync(path.join(componentsPath, folder, 'package.json'))
            )

            if (packageJson.ieremeev && packageJson.ieremeev.build === false) {
                return false
            }

            return true
        })
        .map(folder => path.join(componentsPath, folder, 'src'))

const buildFile = ({ src, force = true, log = true }) => {
    const dest = src.replace('/src/', '/es/')
    const distDest = src.replace('/src/', '/dist/')

    // Check if we need to build file
    if (!force && fs.existsSync(dest) && fs.existsSync(distDest)) {
        const { mtime: srcTime } = fs.statSync(src)
        const { mtime: esTime } = fs.statSync(dest)
        const { mtime: distTime } = fs.statSync(distDest)

        if (srcTime <= esTime && srcTime <= distTime) {
            return
        }
    }

    if (log) {
        console.info(src.replace(new RegExp(componentsPath + '/', 'g'), ''))
    }

    if (/\.js$/.test(src)) {
        transformFile(
            src,
            {
                babelrc: false,
                ast: false,
                presets: [['ieremeev', { onlyChrome: true }]],
            },
            (err, result) => {
                if (err) {
                    console.error(err)
                    return
                }
                fse.outputFile(dest, result.code)
                fse.outputFile(distDest, result.code)
            }
        )
    } else {
        fse.copy(src, dest)
        fse.copy(src, distDest)
    }
}

module.exports = {
    componentsPath,
    escapeTags,
    getStagedJsFiles,
    getModifiedJsFiles,
    getPublishingFolders,
    checkGitClean,
    getExampleData,
    getAuthor,
    getInitialPackageJson,
    processGitignore,
    processPackagejson,
    processReadme,
    getComponentName,
    getFoldersToBuild,
    buildFile,
}
