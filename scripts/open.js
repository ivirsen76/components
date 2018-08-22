#!/usr/bin/env node
const path = require('path')
const express = require('express')
const colors = require('colors/safe')

const app = express()
const buildPath = path.join(__dirname, '..', '/build')
const port = process.env.PORT || 3000

const staticPath = buildPath
app.use(express.static(staticPath))
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, '/index.html'))
})

app.listen(port, () => {
    console.info('Site is available on ' + colors.green(`http://localhost:${port}`))
})
