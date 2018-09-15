require('dotenv').config()
const spawn = require('cross-spawn')

module.exports = {
    getStagedJsFiles() {
        return spawn
            .sync('git', ['diff', '--cached', '--name-only'])
            .stdout.toString()
            .trim()
            .split('\n')
            .filter(file => /\.js$/.test(file))
    },
    getEnvVars() {
        return Object.keys(process.env)
            .filter(key => /^IE_/.test(key))
            .reduce((env, key) => {
                env[`process.env.${key}`] = JSON.stringify(process.env[key])
                return env
            }, {})
    },
}
