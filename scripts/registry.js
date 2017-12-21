#!/usr/bin/env babel-node
import spawn from 'cross-spawn'

const result = spawn.sync('npm', ['config', 'get', 'registry'])
const registry = result.stdout.toString().trim()

if (registry !== 'https://registry.npmjs.org/') {
    console.error('Invalid npm registry')
    process.exit(1)
}
