/* eslint-disable global-require */
const env = require('babel-preset-env')
const react = require('babel-preset-react')
const stage2 = require('babel-preset-stage-2')

const globalOptions = process.env.IEREMEEV ? JSON.parse(process.env.IEREMEEV) : {}

function getPreset(api, options = {}) {
    const { modules, justChrome } = Object.assign({}, globalOptions, options)
    const browsers = justChrome ? ['last 2 Chrome versions'] : ['> 2% in US']

    return {
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
            stage2,
        ],
    }
}

module.exports = getPreset
