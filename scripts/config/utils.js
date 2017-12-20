const spawn = require('cross-spawn')
const path = require('path')
const fs = require('fs')
const parse = require('react-docgen').parse

function getFiles(filepath) {
    return fs.readdirSync(filepath).filter(file => fs.statSync(path.join(filepath, file)).isFile())
}

const getStagedJsFiles = () =>
    spawn
        .sync('git', ['diff', '--cached', '--name-only'])
        .stdout.toString()
        .trim()
        .split('\n')
        .filter(file => /\.js$/.test(file))

const getExampleData = componentPath => {
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
            .filter(file => file !== 'index.js')
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

module.exports = {
    getStagedJsFiles,
    getExampleData,
}
