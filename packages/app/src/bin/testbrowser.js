#!/usr/bin/env node
import spawn from 'cross-spawn'

const testcafe = require.resolve('testcafe/bin/testcafe.js')
const args = process.argv.slice(2)

// Run php server
const php = spawn('php', ['-S', '127.0.0.1:5555', '-t', 'public'], {
    stdio: 'ignore',
})
process.on('exit', () => php.kill())

const result = spawn.sync(
    'node',
    [testcafe]
        .concat(args)
        .concat(['--assertion-timeout', '10000', 'chrome', 'src/testcafe/**/*.page.js']),
    {
        stdio: 'inherit',
    }
)

process.exit(result.status)
