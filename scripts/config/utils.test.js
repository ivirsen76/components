import { getInitialPackageJson } from './utils.js'

describe('getInitialPackageJson()', () => {
    it('Should return config for react component', () => {
        const result = getInitialPackageJson('Some', { isReact: true, description: 'Some desc' })
        expect(result).toEqual({
            name: 'Some',
            version: '1.0.0',
            description: 'Some desc',
            src: 'src/index.js',
            main: 'dist/index.js',
            module: 'es/index.js',
            author: 'Igor Eremeev <ivirsen@gmail.com>',
            license: 'MIT',
            peerDependencies: { react: '14' },
            dependencies: {},
        })
    })

    it('Should return config for usual component without build step', () => {
        const result = getInitialPackageJson('Some', {
            isReact: false,
            isBuildStep: false,
            description: 'Some desc',
        })
        expect(result).toEqual({
            name: 'Some',
            version: '1.0.0',
            description: 'Some desc',
            main: 'src/index.js',
            author: 'Igor Eremeev <ivirsen@gmail.com>',
            license: 'MIT',
            dependencies: {},
            ieremeev: { build: false },
        })
    })

    it('Should return config for usual component with build step', () => {
        const result = getInitialPackageJson('Some', {
            isReact: false,
            isBuildStep: true,
            description: 'Some desc',
        })
        expect(result).toEqual({
            name: 'Some',
            version: '1.0.0',
            description: 'Some desc',
            src: 'src/index.js',
            main: 'dist/index.js',
            module: 'es/index.js',
            author: 'Igor Eremeev <ivirsen@gmail.com>',
            license: 'MIT',
            dependencies: {},
        })
    })
})
