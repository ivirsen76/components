module.exports = {
    extends: 'airbnb',
    env: {
        browser: true,
        jest: true,
    },
    parser: 'babel-eslint',
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'prefer-const': ['off'],
        'react/sort-comp': ['off'],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-no-bind': ['off'],
        'react/jsx-filename-extension': ['off'],
        'react/forbid-prop-types': ['off'],
        'react/no-danger': ['off'],
        'import/no-extraneous-dependencies': ['error', { peerDependencies: true }],
        'import/prefer-default-export': ['off'],
        'jsx-a11y/no-static-element-interactions': ['off'],
        'prefer-template': ['off'],
        'max-len': ['error', 160],
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-unused-vars': ['error', { vars: 'all', args: 'none' }],
        'no-unused-expressions': ['off'],
        'no-param-reassign': ['off'],
        'no-plusplus': ['off'],
        'quote-props': ['off'],
        semi: ['error', 'never'],
        'arrow-parens': ['error', 'as-needed'],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore',
            },
        ],
        'import/no-webpack-loader-syntax': ['off'],
        'react/prefer-stateless-function': ['off'],
        'import/extensions': ['off'],
        'import/first': ['off'],
        'no-underscore-dangle': ['off'],
        'no-alert': ['off'],
    },
    settings: {
        'import/resolver': {
            webpack: {
                config: {
                    resolve: {
                        mainFields: ['src', 'module', 'main'],
                    },
                },
            },
        },
    },
}
