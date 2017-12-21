export default {
    setupFiles: [require.resolve('babel-polyfill'), require.resolve('./jestSetup.js')],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    moduleNameMapper: {
        '^.+\\.(css|scss|less|mp3)$': 'identity-obj-proxy',
        '^@ieremeev/(.*)': '<rootDir>/packages/$1/src/index.js',
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
    },
    roots: ['<rootDir>/src', '<rootDir>/packages'],
    testMatch: ['**/?(*.)test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
    transform: {
        '^.+\\.(js|jsx)$': require.resolve('./babelTransform.js'),
    },
    transformIgnorePatterns: ['/(?!node_modules/cccisd-)node_modules/'],
}
