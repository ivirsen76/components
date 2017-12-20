import fs from 'fs'
import path from 'path'

const currentDir = process.cwd()

// Compose roots
const roots = []
if (fs.existsSync(path.join(currentDir, 'src'))) {
    roots.push('<rootDir>/src')
}

export default {
    setupFiles: [require.resolve('babel-polyfill')],
    snapshotSerializers: [require.resolve('./serializer.js')],
    moduleNameMapper: {
        '^.+\\.(css|scss|less|mp3)$': 'identity-obj-proxy',
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
    },
    roots,
    testMatch: ['**/?(*.)test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
    transform: {
        '^.+\\.(js|jsx)$': require.resolve('./babelTransform.js'),
    },
    transformIgnorePatterns: ['/(?!node_modules/cccisd-)node_modules/'],
}
