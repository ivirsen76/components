const colors = require('colors/safe')
const checkVersions = require('check-node-version')

const npmVersion = '^6.2.0'

module.exports = () =>
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
                console.error(colors.red('To install npm, run "npm install -g npm@6"'))
                process.exit(1)
            }

            resolve()
        })
    })
