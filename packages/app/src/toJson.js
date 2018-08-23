const enzymeToJson = require('enzyme-to-json')
const _forEach = require('lodash/forEach')

const convert = obj => {
    if (obj.props) {
        const newProps = {}

        _forEach(obj.props, (prop, key) => {
            newProps[key] = typeof prop === 'object' ? {} : prop
        })

        obj.props = newProps
    }

    if (obj.children) {
        obj.children = obj.children.map(child => convert(child))
    }

    return obj
}

module.exports = wrapper => {
    const json = enzymeToJson(wrapper)
    return convert(json)
}
