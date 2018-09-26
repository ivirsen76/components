import React from 'react'
import PropTypes from 'prop-types'
import Sync from './sync.js'
import { Formik as OriginalFormik } from 'formik'

/** Wrapper for Formik package */
export const Formik = class Formik extends React.Component {
    static propTypes = {
        onValidChange: PropTypes.func,
        render: PropTypes.func,
    }

    render() {
        if (!this.props.onValidChange || !this.props.render) {
            return <OriginalFormik {...this.props} />
        }

        const render = args => (
            <div>
                <Sync {...args} update={this.props.onValidChange} />
                {this.props.render(args)}
            </div>
        )

        return <OriginalFormik {...this.props} render={render} />
    }
}

export { SemanticFieldWrapper } from './SemanticFieldWrapper'
export { SemanticInput } from './SemanticInput'
export {
    yupToFormErrors,
    validateYupSchema,
    Field,
    Form,
    withFormik,
    move,
    swap,
    insert,
    replace,
    FieldArray,
    getIn,
    setIn,
    setNestedObjectValues,
    isFunction,
    isObject,
    isInteger,
    isString,
    isNaN,
    isEmptyChildren,
    isPromise,
    getActiveElement,
    FastField,
    FormikProvider,
    FormikConsumer,
    connect,
    ErrorMessage,
} from 'formik'
