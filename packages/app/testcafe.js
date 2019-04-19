const testcafe = require('testcafe')
const ReactSelector = require('testcafe-react-selectors').ReactSelector

require('dotenv').config()

const { IE_CLIENT_HOST, IE_CLIENT_PORT } = process.env

module.exports = testcafe
module.exports.ReactSelector = ReactSelector
module.exports.url = path => `http://${IE_CLIENT_HOST}:${IE_CLIENT_PORT}${path}`
