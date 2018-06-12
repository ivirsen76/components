# @ieremeev/app

The purpose of this package is to provide tools to lint, test, format and build your javascript code. Also, this package hides complexity of using and upgrading many tools.

Under the hood the packages uses `webpack`, `babel`, `eslint`, `prettier` and `jest`

## Installation

Run this command:

    npm install @ieremeev/app --save-dev

Usually you don't need any other dev dependencies.<br>
You don't need any global npm dependencies (like `webpack` or `eslint`).

## Usage

### Assumptions

1. You are using at least react 16
2. All your javascript code is in `src` folder
3. All javascript test files ends with `.test.js`

### Scripts

All of the developing tasks will be run via npm-scripts. Your script section of package.json could look like this:

    "scripts": {
        "start": "ieremeev-app-build --watch",
        "build": "ieremeev-app-build",
        "lint": "ieremeev-app-lint",
        "format": "ieremeev-app-format",
        "test": "ieremeev-app-test --watch",
        "analyze": "ieremeev-app-analyze-bundle",
        "check": "ieremeev-app-lint && ieremeev-app-test",
        "precommit": "ieremeev-app-format -s && ieremeev-app-lint -s && ieremeev-app-test -s"
    }

Let's discuss all the scripts provided by the package:

#### ieremeev-app-build
`ieremeev-app-build` - creates bundle files<br>
`ieremeev-app-build --watch` - creates bundle files in memory, watches for changes and reloads browser automatically<br>
`NODE_ENV=production ieremeev-app-build` - creates bundle files, minifies code, removes unused code

#### ieremeev-app-lint
`ieremeev-app-lint` - checks all js files for linting errors<br>
`ieremeev-app-lint --staged` - checks only js files which are in git staged area

#### ieremeev-app-test
`ieremeev-app-test` - runs all js tests<br>
`ieremeev-app-test --watch` - runs js tests only related to changed files and watches for changes<br>
`ieremeev-app-test --staged` - runs js tests only related to files in git staged area

#### ieremeev-app-format
`ieremeev-app-format` - formats all js files (applies code style)<br>
`ieremeev-app-format --staged` - formats js files from git staged area and `git add` changes

#### ieremeev-app-analyze-bundle
`ieremeev-app-analyze-bundle` - analyze minified js bundle with GZIP size information<br>
`ieremeev-app-analyze-bundle --dev` - analyze unminified js bundle (much faster)
