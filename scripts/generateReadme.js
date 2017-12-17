const fs = require('fs')
const path = require('path')
const parse = require('react-docgen').parse
const _forEach = require('lodash/forEach')

const currentDir = process.cwd()
const packageJson = JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json')))
const mainFile = fs.readFileSync(path.join(currentDir, packageJson.src), 'utf-8').toString()
const packageInfo = parse(mainFile)

let readme = ''
readme += `# ${packageInfo.displayName}\n\n`
readme += packageInfo.description + '\n\n'
readme += `[Demo](http://demo.ieremeev.com/${packageJson.name.replace(/@ieremeev\//, '')})\n\n\n`

// Installation
readme += '## Installation\n\n'
readme += '```\n'
readme += `npm install ${packageJson.name}\n`
readme += '```\n\n\n'

// Props
readme += '## Props\n\n'
_forEach(packageInfo.props, (prop, name) => {
    readme += `* **${name}** - (type: ${prop.type.name}, default: ${prop.defaultValue.value})<br>\n`
    readme += prop.description + '\n\n'
})

fs.writeFileSync(path.join(currentDir, 'README.md'), readme)
