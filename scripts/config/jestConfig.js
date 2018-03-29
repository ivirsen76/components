export default {
    setupFiles: [require.resolve('babel-polyfill'), require.resolve('./jestSetup.js')],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    moduleNameMapper: {
        '^.+\\.(css|scss|less|mp3|svg)$': 'identity-obj-proxy',
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
    },
    roots: ['<rootDir>/src', '<rootDir>/packages', '<rootDir>/scripts'],
    testMatch: ['**/?(*).test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/es/', '/dist/'],
    transform: {
        '^.+\\.js$': require.resolve('./babelTransform.js'),
    },
}
