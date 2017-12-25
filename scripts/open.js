#!/usr/bin/env node
const path = require('path')
const express = require('express')

const app = express()
const buildPath = path.join(__dirname, '..', '/build')
const port = process.env.PORT || 3000
console.log(process.env)

if (process.env.NODE_ENV !== 'production') {
    const staticPath = buildPath
    app.use(express.static(staticPath))
}
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, '/index.html'))
})

app.listen(port, () => {
    console.info(`Listening on port ${port}`)
})
