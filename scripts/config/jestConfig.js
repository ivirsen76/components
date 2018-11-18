module.exports = {
    setupFiles: [require.resolve('babel-polyfill')],
    moduleNameMapper: {
        '^.+\\.(css|scss|less|mp3|svg|png)$': 'identity-obj-proxy',
        '^react$': '<rootDir>/node_modules/react',
        '^react-dom$': '<rootDir>/node_modules/react-dom',
    },
    roots: ['<rootDir>/src', '<rootDir>/packages', '<rootDir>/scripts'],
    testMatch: ['**/?(*).test.js'],
    testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/es/', '/dist/'],
    testURL: 'http://localhost',
    transform: {
        '^.+\\.js$': require.resolve('./babelTransform.js'),
    },
}
