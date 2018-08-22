#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const currentDir = process.cwd()
const sandboxFolderPath = path.join(currentDir, 'src', 'Sandbox')
const sandboxFilePath = path.join(currentDir, 'src', 'Sandbox', 'index.js')
const defaultSandbox = `import React from 'react'

export default () => <div>Sandbox area</div>
`

if (!fs.existsSync(sandboxFolderPath)) {
    fs.mkdirSync(sandboxFolderPath)
}

if (!fs.existsSync(sandboxFilePath)) {
    fs.writeFileSync(sandboxFilePath, defaultSandbox)
}
