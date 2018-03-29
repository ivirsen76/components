#!/usr/bin/env babel-node
import path from 'path'
import fs from 'fs'
import readdir from 'recursive-readdir'
import { transformFile } from 'babel-core'
import { writeOnlyIfChanged, copyOnlyIfChanged } from './config/utils.js'

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
