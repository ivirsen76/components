module.exports = {
    setupFiles: [require.resolve('babel-polyfill')],
    snapshotSerializers: [require.resolve('./serializer.js')],
    moduleNameMapper: {
        '^.+\\.(css|scss|less|mp3)$': 'identity-obj-proxy',
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
    },
    roots: ['<rootDir>/resources/assets/js'],
    testMatch: ['**/?(*.)test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
    transform: {
        '^.+\\.(js|jsx)$': require.resolve('./babelTransform.js'),
    },
    globals: {
        cccisd: {
            boilerplate: {
                settings: {},
            },
        },
    },
}
