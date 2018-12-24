#!/usr/bin/env node
const spawn = require('cross-spawn')
const webpack = require('webpack')
const colors = require('colors/safe')
const fs = require('fs')
const path = require('path')
const configDev = require('../webpack.config.dev.js')

configDev.devtool = false // no source maps as testcafe doesn't use them

let isTestcafeRunning = false
let lastHash = null

const reloadTestcafe = () => {
    // Save db/utils.js file which will force testcafe to reload
    const touchedFile = path.join(process.cwd(), 'src', 'testcafe', 'db', 'utils.js')
    const touchedContent = fs.readFileSync(touchedFile)
    fs.writeFileSync(touchedFile, touchedContent)
}

const runTestcafe = () => {
    if (!isTestcafeRunning) {
        // Run testcafe
        isTestcafeRunning = true
        spawn('npm', ['run', 'testcafe:live'], { stdio: 'inherit' })
    } else {
        // Reload testcafe
        reloadTestcafe()
    }
}

const compiler = webpack(configDev)
compiler.hooks.beforeCompile.tap({ name: 'cccisdBeforeCompile' }, () => {
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
