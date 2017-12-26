const fs = require('fs')
const path = require('path')
const parse = require('react-docgen').parse
const _forEach = require('lodash/forEach')
const getExampleData = require('../config/utils.js').getExampleData

const currentDir = process.cwd()
const packageJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json')))
const mainFile = fs.readFileSync(path.join(currentDir, packageJson.src), 'utf-8').toString()

let packageInfo
try {
    packageInfo = parse(mainFile)
} catch (e) {
    packageInfo = {
        description: packageJson.description || '',
    }
}

let readme = ''
readme += `# ${packageJson.name}\n\n`
readme += `${packageInfo.description}\n\n`
readme += `[Demo](http://packages.piclub.ru/${packageJson.name.replace(/@ieremeev\//, '')})\n\n\n`

// Installation
readme += '## Installation\n\n'
readme += '```\n'
readme += `npm install ${packageJson.name}\n`
readme += '```\n\n\n'

// Props
if (packageInfo.props) {
    readme += '## Props\n\n'
    _forEach(packageInfo.props, (prop, name) => {
        const defaultValue = prop.defaultValue ? prop.defaultValue.value : 'null'
        readme += `* **${name}** - (type: ${prop.type.name}, default: ${defaultValue})<br>\n`
        readme += prop.description.replace(/<\/?pre>/g, '```') + '\n\n'
    })
    readme += '\n'
}

// Examples
const examples = getExampleData(currentDir)
if (examples.length > 0) {
    readme += '## Examples\n\n'
    _forEach(examples, example => {
        readme += `### ${example.title}\n`
        if (example.description) {
            readme += `${example.description}\n`
        }
        readme += '```\n'
        readme += example.code
        readme += '```\n\n\n'
    })
}

fs.writeFileSync(path.join(currentDir, 'README.md'), readme)
