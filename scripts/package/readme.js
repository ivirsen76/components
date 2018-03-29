const fs = require('fs')
const path = require('path')
const parse = require('react-docgen').parse
const _map = require('lodash/map')
const getExampleData = require('../config/utils.js').getExampleData

const currentDir = process.cwd()
const packageJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json')))
const mainFile = packageJson.src
    ? fs.readFileSync(path.join(currentDir, packageJson.src), 'utf8')
    : ''

const processTemplate = (template, params) => {
    let result = template
    Object.keys(params).forEach(key => {
        result = result.replace('{{' + key + '}}', params[key])
    })
    return result
}

const getParams = () => {
    let packageInfo
    try {
        packageInfo = parse(mainFile)
    } catch (e) {
        packageInfo = {
            description: packageJson.description || '',
        }
    }

    const params = {}
    params.name = packageJson.name
    params.description = packageInfo.description
    params.demoLink = `[Demo](http://packages.piclub.ru/components/${params.name.replace(
        /@ieremeev\//,
        ''
    )})`

    // Introducation section
    params.nameSection = `# ${packageJson.name}\n\n${packageInfo.description}\n${params.demoLink}`

    // Installation section
    params.installationSection = `## Installation\n\n\`\`\`\nnpm install ${
        packageJson.name
    }\n\`\`\``

    // Props section
    params.propsSection = ''
    if (packageInfo.props) {
        params.propsSection += '## Props\n\n'
        params.propsSection += _map(packageInfo.props, (prop, name) => {
            if (prop.description.includes('@ignore')) {
                return null
            }

            let result = ''
            const defaultValue = prop.defaultValue ? prop.defaultValue.value : 'null'
            result += `* **${name}** - (type: ${prop.type.name}, default: ${defaultValue})`
            if (prop.description) {
                result += '<br>\n' + prop.description.replace(/<\/?pre>/g, '```')
            }
            return result
        })
            .filter(prop => prop)
            .join('\n\n')
    }

    // Examples section
    params.examplesSection = ''
    const examples = getExampleData(currentDir)
    if (examples.length > 0) {
        params.examplesSection += '## Examples\n\n'
        params.examplesSection += examples
            .map(example => {
                let result = `### ${example.title}\n`
                if (example.description) {
                    result += `${example.description}\n`
                }
                result += '```\n'
                result += example.code
                result += '```'
                return result
            })
            .join('\n\n\n')
    }

    return params
}

// Get readme template
const defaultTemplateFile = require.resolve('../config/default.READMEtemplate.md')
const packageTemplateFile = path.join(currentDir, 'READMEtemplate.md')
const actualTemplateFile = fs.existsSync(packageTemplateFile)
    ? packageTemplateFile
    : defaultTemplateFile
const readmeTemplate = fs.readFileSync(actualTemplateFile, 'utf8')

fs.writeFileSync(path.join(currentDir, 'README.md'), processTemplate(readmeTemplate, getParams()))
