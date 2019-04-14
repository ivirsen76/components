#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const colors = require('colors/safe')
const _isEqual = require('lodash/isEqual')
const _pickBy = require('lodash/pickBy')
const _omitBy = require('lodash/omitBy')

// we need to find package.json from the app
const filename = path.join(__dirname, '..', '..', '..', '..', 'package.json')
if (!fs.existsSync(filename)) {
    console.error(`There is no file "${filename}"`)
    return
}

const isAppScript = (value, key) => /^app:/.test(key)

let obj = JSON.parse(fs.readFileSync(filename))
const appScripts = _pickBy(obj.scripts, isAppScript)
const oldScripts = _omitBy(obj.scripts, isAppScript)
const newScripts = {
    start: 'npm-run-all --parallel start:client start:server',
    'start:client': 'ieremeev-app-client-dev',
    'start:server': 'npm run migrate && nodemon src/server/',
    'start:prod': 'npm-run-all --parallel start:client:prod start:server:prod',
    'start:client:prod': 'ieremeev-app-client-prod',
    'start:server:prod': 'npm run migrate && node src/server/',
    migrate: 'sequelize db:migrate',
    build: 'ieremeev-app-build',
    lint: 'ieremeev-app-lint',
    format: 'ieremeev-app-format',
    test: 'ieremeev-app-test --watch',
    'test:prod': 'jest -c=\'{"testMatch":["**/?(*.)prod.js"]}\' src/server/test.prod.js',
    testcafe: "testcafe chrome:headless -e 'src/testcafe/**/*.page.js'",
    'testcafe:dev': 'ieremeev-app-testcafe-develop',
    'testcafe:prod': "testcafe chrome:headless 'src/testcafe/**/*.prod.js'",
    'db:restore': 'ieremeev-app-restore-db',
    'db:dump': 'ieremeev-app-generate-dump',
    'user:add': 'node src/bin/addUser.js',
    updateScripts: 'ieremeev-app-update-scripts',
    analyze: 'ieremeev-app-analyze-bundle',
    duplicate: 'ieremeev-app-duplicate',
    check: 'ieremeev-app-lint && ieremeev-app-test',
    deploy: 'shipit production deploy',
    precommit: 'ieremeev-app-format -s && ieremeev-app-lint -s && ieremeev-app-test -s',
}

if (_isEqual(oldScripts, newScripts)) {
    console.info('NPM-scripts in package.json are up-to-date\n')
    return
}
obj.scripts = { ...appScripts, ...newScripts }

const content = JSON.stringify(obj, null, 4) + '\n'
fs.writeFileSync(filename, content)

console.info(colors.green('NPM-scripts in package.json have been updated\n'))
