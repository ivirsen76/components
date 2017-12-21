/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path'
import fs from 'fs'
import React from 'react'
import { shallow } from 'enzyme'

function getComponentName(filepath) {
    return filepath.replace(/^.*\/([^/]*)\/examples$/, '$1')
}

function getFileName(filepath) {
    return filepath.replace(/^.*\/([^/]*)$/, '$1')
}

function getAllFiles(filepath) {
    return fs
        .readdirSync(filepath)
        .filter(
            file =>
                fs.statSync(path.join(filepath, file)).isFile() &&
                file !== 'index.js' &&
                file !== 'index.test.js'
        )
        .map(file => path.join(filepath, file))
}

export default filepath => {
    let ignoredFiles = []
    const indexFile = path.join(filepath, 'index.js')
    if (fs.existsSync(indexFile)) {
        ignoredFiles = require(indexFile)
            .default.filter(example => example.test === false)
            .map(example => example.file)
    }

    describe(getComponentName(filepath), () => {
        getAllFiles(filepath)
            .filter(file => !ignoredFiles.includes(file))
            .forEach(file => {
                it(getFileName(file), () => {
                    const Component = require(file).default
                    const wrapper = shallow(<Component />)
                    expect(wrapper).toMatchSnapshot()
                })
            })
    })
}
