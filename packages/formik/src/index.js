import React from 'react'
import PropTypes from 'prop-types'
import * as original from 'formik'
import Sync from './sync.js'
import SemanticFieldWrapper from './SemanticFieldWrapper'
import SemanticInput from './SemanticInput'

const { Formik } = original

/** Wrapper for Formik package */
class FormikWrapper extends React.Component {
    static propTypes = {
        onValidChange: PropTypes.func,
        render: PropTypes.func,
    }

    render() {
        if (!this.props.onValidChange || !this.props.render) {
            return <Formik {...this.props} />
        }

        const render = args => (
            <div>
                <Sync {...args} update={this.props.onValidChange} />
                {this.props.render(args)}
            </div>
        )

        return <Formik {...this.props} render={render} />
    }
}

module.exports = {
    ...original,
    Formik: FormikWrapper,
    SemanticFieldWrapper,
    SemanticInput,
}
