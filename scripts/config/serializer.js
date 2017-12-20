import { isEnzymeWrapper } from 'enzyme-to-json/build/utils'
import toJson from './toJson.js'

module.exports = {
    test(wrapper) {
        return isEnzymeWrapper(wrapper)
    },
    print(wrapper, serializer) {
        return serializer(toJson(wrapper))
    },
}
