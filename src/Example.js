import React from 'react'
import PropTypes from 'prop-types'

export default class Component extends React.Component {
    static propTypes = {
        example: PropTypes.object,
    }

    render() {
        const { example } = this.props
        console.log(example.filePath)
        const ExampleComponent = require('../packages/paginator/examples/simple.js').default

        return (
            <div>
                <ExampleComponent />
                {example.code}
            </div>
        )
    }
}
