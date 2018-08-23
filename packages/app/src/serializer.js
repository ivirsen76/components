const { isEnzymeWrapper } = require('enzyme-to-json/build/utils')
const toJson = require('./toJson.js')

module.exports = {
    test(wrapper) {
        return isEnzymeWrapper(wrapper)
    },
    print(wrapper, serializer) {
        return serializer(toJson(wrapper))
    },
}
