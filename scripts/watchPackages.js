#!/usr/bin/env babel-node
const path = require('path')
const fse = require('fs-extra')
const chokidar = require('chokidar')
const { transformFile } = require('babel-core')
const { writeOnlyIfChanged, copyOnlyIfChanged } = require('./config/utils.js')

const componentsPath = path.join(__dirname, '../packages')

const srcFolders = fse
    .readdirSync(componentsPath)
    .filter(folder => fse.statSync(path.join(componentsPath, folder)).isDirectory())
    .filter(folder => {
        const packageJson = JSON.parse(
            fse.readFileSync(path.join(componentsPath, folder, 'package.json'))
        )

        if (packageJson.ieremeev && packageJson.ieremeev.build === false) {
            return false
        }

        return true
    })
    .map(folder => path.join(componentsPath, folder, 'src'))

chokidar
    .watch(srcFolders)
    .on('change', src => {
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
    .on('unlink', filename => {
        const dest = filename.replace('/src/', '/es/')
        const distDest = filename.replace('/src/', '/dist/')
        fse.remove(dest)
        fse.remove(distDest)
    })
