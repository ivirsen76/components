/* eslint-disable global-require */
const env = require('@babel/preset-env')
const react = require('@babel/preset-react')

const globalOptions = process.env.BABEL_PRESET_IEREMEEV
    ? JSON.parse(process.env.BABEL_PRESET_IEREMEEV)
    : {}

function getPreset(api, options = {}) {
    const { modules, onlyChrome } = Object.assign({}, globalOptions, options)
    const browsers = onlyChrome ? ['last 2 Chrome versions'] : ['> 2% in US']

    return {
        plugins: [['@babel/plugin-proposal-class-properties', { loose: false }]],
        presets: [
            [
                env,
                {
                    targets: {
                        browsers,
                    },
                    modules,
                },
            ],
            react,
        ],
    }
}

module.exports = getPreset
