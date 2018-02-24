#!/usr/bin/env babel-node
import path from 'path'
import fse from 'fs-extra'
import chokidar from 'chokidar'
import { transformFile } from 'babel-core'

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
    .on('change', filename => {
        const destination = filename.replace('/src/', '/es/')

        if (/\.js$/.test(filename)) {
            transformFile(
                filename,
                {
                    babelrc: false,
                    ast: false,
                    presets: ['ieremeev'],
                },
                (err, result) => {
                    fse.outputFile(destination, result.code)
                }
            )
        } else {
            fse.copy(filename, destination)
        }
    })
    .on('unlink', filename => {
        const destination = filename.replace('/src/', '/es/')
        fse.remove(destination)
    })
