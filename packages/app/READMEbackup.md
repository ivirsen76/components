# cccisd-app

The purpose of this package is to provide tools to lint, test, format and build your javascript code. Also, this package hides complexity of using and upgrading many tools.

Under the hood the packages uses `webpack`, `babel`, `eslint`, `prettier`, `jest`, and `testcafe`

## Installation

Run this command:

    npm install cccisd-app --save-dev

Usually you don't need any other dev dependencies.<br>
You don't need any global npm dependencies (like `webpack` or `eslint`).

## Usage

### Assumptions

1. You are using at least react 15
2. All your javascript code is in `resources/assets/js` folder
3. All javascript test files ends with `.test.js`
4. All javascript end2end test files ends with `.page.js`

### Scripts

All of the developing tasks will be run via npm-scripts. Your script section of package.json could look like this:

    "scripts": {
        "start": "cccisd-app-build --watch",
        "build": "cccisd-app-build",
        "lint": "cccisd-app-lint",
        "format": "cccisd-app-format",
        "test": "cccisd-app-test --watch",
        "test:browser": "cccisd-app-testbrowser",
        "analyze": "cccisd-app-analyze-bundle",
        "laravel": "cccisd-app-update-laravel-deps",
        "check": "cccisd-app-lint && cccisd-app-test",
        "precommit": "cccisd-app-format -s && cccisd-app-lint -s && cccisd-app-test -s"
    }

Let's discuss all the scripts provided by the package:

#### cccisd-app-build
`cccisd-app-build` - creates bundle files<br>
`cccisd-app-build --watch` - creates bundle files in memory, watches for changes and reloads browser automatically<br>
`NODE_ENV=production cccisd-app-build` - creates bundle files, minifies code, removes unused code

#### cccisd-app-lint
`cccisd-app-lint` - checks all js files for linting errors<br>
`cccisd-app-lint --staged` - checks only js files which are in git staged area

#### cccisd-app-test
`cccisd-app-test` - runs all js tests<br>
`cccisd-app-test --watch` - runs js tests only related to changed files and watches for changes<br>
`cccisd-app-test --staged` - runs js tests only related to files in git staged area

#### cccisd-app-testbrowser
`cccisd-app-testbrowser` - runs all end2end tests in a browser

#### cccisd-app-format
`cccisd-app-format` - formats all js files (applies code style)<br>
`cccisd-app-format --staged` - formats js files from git staged area and `git add` changes

#### cccisd-app-analyze-bundle
`cccisd-app-analyze-bundle` - analyze minified js bundle with GZIP size information<br>
`cccisd-app-analyze-bundle --dev` - analyze unminified js bundle (much faster)

#### cccisd-app-update-laravel-deps
`cccisd-app-update-laravel-deps` - update npm dependencies from laravel packages
