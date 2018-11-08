const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const _round = require('lodash.round')

const icons = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json')))

const getWidth = viewBox => {
    const array = viewBox.split(' ')
    const viewWidth = +array[2]
    const viewHeight = +array[3]

    if (viewWidth === viewHeight) {
        return '1em'
    }

    return `${_round(viewWidth / viewHeight, 2)}em`
}

icons.forEach(icon => {
    // Generate icons
    ;(() => {
        const filename = path.join(__dirname, '..', icon.name + '.js')
        const content = `
        import React from 'react';
        import IconBase from './dist/IconBase.js';

        export default props => (
            <IconBase
                viewBox="${icon.viewBox}"
                {...props}
                style={{ width: '${getWidth(icon.viewBox)}' }}
            >
                <g>
                    ${icon.paths.map(item => `<path d="${item}" />`).join('\n')}
                </g>
            </IconBase>
        );
    `
        fs.writeFileSync(filename, babel.transform(content, { presets: ['cccisd'] }).code)
    })()

    // Generate svgs
    ;(() => {
        const dir = path.join(__dirname, '..', 'svg')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        const filename = path.join(dir, icon.name + '.js')
        const content = `
        import React from 'react';

        export default (props) => (
            <svg viewBox="${icon.viewBox}" {...props}>
                <g>
                    ${icon.paths.map(item => `<path d="${item}" />`).join('\n')}
                </g>
            </svg>
        );
    `
        fs.writeFileSync(filename, babel.transform(content, { presets: ['cccisd'] }).code)
    })()
})

console.log('Done!')
