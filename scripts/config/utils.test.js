const { getInitialPackageJson, getComponentName, getAuthor } = require('./utils.js')

describe('getComponentName()', () => {
    it('Should return component name', () => {
        expect(getComponentName('some')).toBe('Some')
    })

    it('Should return component name for dashed string', () => {
        expect(getComponentName('some-staff')).toBe('SomeStaff')
    })
})

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
            author: getAuthor(),
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
            author: getAuthor(),
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
            author: getAuthor(),
            license: 'MIT',
            dependencies: {},
        })
    })
})
