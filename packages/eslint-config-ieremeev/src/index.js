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
        'class-methods-use-this': ['off'],
        'func-names': ['off'],
        'import/extensions': ['off'],
        'import/first': ['off'],
        'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],
        'import/no-webpack-loader-syntax': ['off'],
        'import/prefer-default-export': ['off'],
        'jest/no-disabled-tests': ['error'],
        'jsx-a11y/anchor-is-valid': ['off'],
        'jsx-a11y/click-events-have-key-events': ['off'],
        'jsx-a11y/label-has-associated-control': ['off'],
        'jsx-a11y/label-has-for': ['off'],
        'jsx-a11y/no-autofocus': ['off'],
        'jsx-a11y/no-noninteractive-element-interactions': ['off'],
        'jsx-a11y/no-static-element-interactions': ['off'],
        'no-alert': ['off'],
        'no-await-in-loop': ['off'],
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-param-reassign': ['off'],
        'no-plusplus': ['off'],
        'no-throw-literal': ['off'],
        'no-underscore-dangle': ['off'],
        'no-unused-expressions': ['off'],
        'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
        'prefer-const': ['off'],
        'prefer-destructuring': ['off'],
        'prefer-promise-reject-errors': ['off'],
        'prefer-template': ['off'],
        'quote-props': ['off'],
        'react/destructuring-assignment': ['off'],
        'react/forbid-prop-types': ['off'],
        'react/jsx-filename-extension': ['off'],
        'react/jsx-no-bind': ['off'],
        'react/no-danger': ['off'],
        'react/no-find-dom-node': ['off'],
        'react/no-unused-prop-types': ['off'],
        'react/prefer-stateless-function': ['off'],
        'react/require-default-props': ['off'],
        'react/sort-comp': ['off'],
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
