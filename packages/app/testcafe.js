const testcafe = require('testcafe')
const ReactSelector = require('testcafe-react-selectors').ReactSelector
const colors = require('colors/safe')

require('dotenv').config()

const { IE_ALLOW_RESTORING_DB, IE_CLIENT_HOST, IE_CLIENT_PORT } = process.env

if (!IE_ALLOW_RESTORING_DB) {
    console.info(
        colors.red(
            'You have to have IE_ALLOW_RESTORING_DB=true in .env file\nYou cannot restore DB without this variable'
        )
    )
    process.exit()
}

module.exports = testcafe
module.exports.ReactSelector = ReactSelector
module.exports.url = path => `http://${IE_CLIENT_HOST}:${IE_CLIENT_PORT}${path}`
