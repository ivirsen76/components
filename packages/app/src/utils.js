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
}
