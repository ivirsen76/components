#!/usr/bin/env node
const webpack = require('webpack')
const colors = require('colors/safe')
const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const createTestCafe = require('testcafe')
const recursive = require('recursive-readdir')
const _once = require('lodash/once')
const configDev = require('../webpack.config.dev.js')

const nodemon = require.resolve('nodemon/bin/nodemon.js')
const serve = require.resolve('serve/bin/serve.js')
require('dotenv').config()

configDev.devtool = false // no source maps as testcafe doesn't use them

let isTestcafeRunning = false
let lastHash = null

const getFirstTestFile = _once(async () => {
    const testcafeDir = path.join(process.cwd(), 'src', 'testcafe')

    let files
    await new Promise(resolve => {
        recursive(testcafeDir, (err, result) => {
            files = result
            resolve()
        })
    })

    return files.find(item => /\.page\.js$/.test(item))
})

const reloadTestcafe = async () => {
    const firstTestFile = await getFirstTestFile()

    // We're gonna save one test file. It will trigger reloading testcafe
    if (fs.existsSync(firstTestFile)) {
        fs.writeFileSync(firstTestFile, fs.readFileSync(firstTestFile))
    }
}

const runTestcafe = async () => {
    if (isTestcafeRunning) {
        reloadTestcafe()
        return
    }

    // Run client
    const client = spawn('node', [serve, '-l', process.env.IE_CLIENT_PORT, '-s', 'build'], {
        stdio: 'inherit',
    })

    // Run server
    const server = spawn(nodemon, ['src/server'], { stdio: 'inherit' })

    // Run testcafe
    isTestcafeRunning = true
    const testcafe = await createTestCafe()
    await testcafe
        .createLiveModeRunner()
        .browsers(
            'chrome:userProfile --auto-open-devtools-for-tabs --autoplay-policy=no-user-gesture-required'
        )
        .run()

    client.kill('SIGINT')
    server.kill('SIGINT')
    testcafe.close()
    process.exit()
}

// run webpack and then testcafe
const compiler = webpack(configDev)
compiler.hooks.beforeCompile.tap({ name: 'ieBeforeCompile' }, () => {
    console.info(colors.yellow('Webpack is compiling...\n'))
})
compiler.watch({ aggregateTimeout: 300 }, (err, stats) => {
    // If nothing is changed
    if (stats.hash === lastHash) {
        console.info('Nothing changed\n')
        return
    }

    lastHash = stats.hash

    if (stats.compilation && stats.compilation.errors.length !== 0) {
        console.error(colors.red('Webpack compiled with errors:\n'))
        console.error(stats.compilation.errors.join('\n') + '\n')
    } else {
        console.info(
            'Webpack compilation time:',
            colors.green(`${(stats.endTime - stats.startTime) / 1000} sec\n`)
        )

        runTestcafe()
    }
})
