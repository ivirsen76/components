module.exports = {
    setupFiles: [require.resolve('babel-polyfill')],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^.+\\.(css|scss|less|mp3)$': 'identity-obj-proxy',
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
    },
    roots: ['<rootDir>/src'],
    testMatch: ['**/?(*.)test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
    transform: {
        '^.+\\.(js|jsx)$': require.resolve('./babelTransform.js'),
    },
}
