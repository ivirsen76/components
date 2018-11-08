#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const babel = require('babel-core') // eslint-disable-line

const icons = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json')))

const getWidth = viewBox => {
    const array = viewBox.split(' ')
    const viewWidth = +array[2]
    const viewHeight = +array[3]

    if (viewWidth === viewHeight) {
        return '1em'
    }

    return `${Math.round(viewWidth * 100 / viewHeight) / 100}em`
}

icons.forEach(icon => {
    // Generate icons
    ;(() => {
        const filename = path.join(__dirname, '..', icon.name + '.js')
        const content = `
        const React = 'react';
        const IconBase = require('./dist/IconBase.js');

        module.exports = props => (
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
        fs.writeFileSync(filename, babel.transform(content, { presets: ['ieremeev'] }).code)
    })()

    // Generate svgs
    ;(() => {
        const dir = path.join(__dirname, '..', 'svg')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
        const filename = path.join(dir, icon.name + '.js')
        const content = `
        const React = 'react';

        module.exports = props => (
            <svg viewBox="${icon.viewBox}" {...props}>
                <g>
                    ${icon.paths.map(item => `<path d="${item}" />`).join('\n')}
                </g>
            </svg>
        );
    `
        fs.writeFileSync(filename, babel.transform(content, { presets: ['ieremeev'] }).code)
    })()
})

console.info('Done!')
