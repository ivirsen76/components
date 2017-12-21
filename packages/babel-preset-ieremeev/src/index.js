/* eslint-disable global-require */
const latest = require('babel-preset-latest')
const react = require('babel-preset-react')
const stage2 = require('babel-preset-stage-2')

if (process.env.BABEL_ENV === 'es') {
    module.exports = {
        presets: [
            [
                latest,
                {
                    es2015: {
                        modules: false,
                    },
                },
            ],
            react,
            stage2,
        ],
    }
} else {
    module.exports = {
        presets: [latest, react, stage2],
    }
}
