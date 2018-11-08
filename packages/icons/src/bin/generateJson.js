const fs = require('fs')
const path = require('path')

const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'IcoMoon-Ultimate.json')))

const result = base.selection.map((icon, index) => ({
    name: icon.name.toLowerCase(),
    paths: base.icons[index].paths,
    tags: base.icons[index].tags,
    viewBox: `0 0 ${base.icons[index].width || 1024} ${base.height}`,
}))

const filename = path.join(__dirname, 'icons.json')
fs.writeFileSync(filename, JSON.stringify(result, null, 4))
