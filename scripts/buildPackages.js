#!/usr/bin/env babel-node
import path from 'path'
import fse from 'fs-extra'
import readdir from 'recursive-readdir'
import { transformFile } from 'babel-core'

const componentsPath = path.join(__dirname, '../packages')

console.info('Building files...')
fse
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
    .forEach(async folder => {
        const files = await readdir(path.join(componentsPath, folder, 'src'))

        files.forEach(src => {
            const dest = src.replace('/src/', '/es/')
            console.info(`${src} -> ${dest}`)

            if (/\.js$/.test(src)) {
                transformFile(
                    src,
                    {
                        babelrc: false,
                        ast: false,
                        presets: ['ieremeev'],
                    },
                    (err, result) => {
                        fse.outputFile(dest, result.code)
                    }
                )
            } else {
                fse.copy(src, dest)
            }
        })
    })
