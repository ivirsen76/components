import colors from 'colors/safe'
import checkVersions from 'check-node-version'

const npmVersion = '^5.5.1'

export default () =>
    new Promise(resolve => {
        checkVersions({ npm: npmVersion }, {}, (err, result) => {
            if (!result.npm.isSatisfied) {
                console.error(
                    colors.red(
                        'You have npm ' +
                            result.npm.version.version +
                            '. Wanted version ' +
                            npmVersion
                    )
                )
                console.error(colors.red('To install npm, run "npm install -g npm@5"'))
                process.exit(1)
            }

            resolve()
        })
    })
