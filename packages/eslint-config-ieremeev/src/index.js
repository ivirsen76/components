const fs = require('fs')
const path = require('path')

const config = {
    plugins: ['jest'],
    extends: ['airbnb', 'prettier', 'prettier/react', 'plugin:jest/recommended'],
    env: {
        browser: true,
        jest: true,
        node: true,
    },
    globals: {
        fixture: true,
    },
    parser: 'babel-eslint',
    root: true,
    rules: {
        'jest/no-disabled-tests': ['error'],
        'prefer-const': ['off'],
        'react/sort-comp': ['off'],
        'react/jsx-no-bind': ['off'],
        'react/jsx-filename-extension': ['off'],
        'react/forbid-prop-types': ['off'],
        'react/no-danger': ['off'],
        'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],
        'import/prefer-default-export': ['off'],
        'jsx-a11y/no-static-element-interactions': ['off'],
        'jsx-a11y/label-has-for': ['off'],
        'prefer-template': ['off'],
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
        'no-unused-expressions': ['off'],
        'no-param-reassign': ['off'],
        'no-plusplus': ['off'],
        'quote-props': ['off'],
        'import/no-webpack-loader-syntax': ['off'],
        'react/prefer-stateless-function': ['off'],
        'import/extensions': ['off'],
        'import/first': ['off'],
        'no-underscore-dangle': ['off'],
        'no-alert': ['off'],
        'react/no-unused-prop-types': ['off'],
        'class-methods-use-this': ['off'],
        'func-names': ['off'],
    },
}

const assetsFolder = path.join(process.cwd(), 'src')
if (fs.existsSync(assetsFolder)) {
    config.settings = {
        'import/resolver': {
            webpack: {
                config: {
                    resolve: {
                        modules: [assetsFolder],
                    },
                },
            },
        },
    }
}

module.exports = config
