#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const readdir = require('recursive-readdir')
const { transformFile } = require('babel-core')
const { writeOnlyIfChanged, copyOnlyIfChanged } = require('./config/utils.js')

const componentsPath = path.join(__dirname, '../packages')

console.info('Building files...')
fs
    .readdirSync(componentsPath)
    .filter(folder => fs.statSync(path.join(componentsPath, folder)).isDirectory())
    .filter(folder => {
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(componentsPath, folder, 'package.json'))
        )

        if (packageJson.ieremeev && packageJson.ieremeev.build === false) {
            return false
        }

        return true
    })
    .forEach(async folder => {
        const files = await readdir(path.join(componentsPath, folder, 'src'))

        files.forEach(src => {
            const dest = src.replace('/src/', '/es/')
            const distDest = src.replace('/src/', '/dist/')
            console.info(src.replace(new RegExp(componentsPath + '/', 'g'), ''))

            if (/\.js$/.test(src)) {
                transformFile(
                    src,
                    {
                        babelrc: false,
                        ast: false,
                        presets: [['ieremeev', { modules: false, onlyChrome: true }]],
                    },
                    (err, result) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        writeOnlyIfChanged(dest, result.code)
                        writeOnlyIfChanged(distDest, result.code)
                    }
                )
            } else {
                copyOnlyIfChanged(src, dest)
                copyOnlyIfChanged(src, distDest)
            }
        })
    })
