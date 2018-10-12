import React from 'react'
import PropTypes from 'prop-types'
import Sync from './sync.js'
import { Formik as OriginalFormik } from 'formik'

/** Wrapper for Formik package */
export const Formik = class Formik extends React.Component {
    static propTypes = {
        onValidChange: PropTypes.func,
        render: PropTypes.func,
        onSubmit: PropTypes.func,
    }

    render() {
        let render = this.props.render
        if (this.props.onValidChange && this.props.render) {
            render = args => (
                <div>
                    <Sync {...args} update={this.props.onValidChange} />
                    {this.props.render(args)}
                </div>
            )
        }

        const onSubmit = async (values, obj) => {
            try {
                await this.props.onSubmit(values, obj)
            } catch (errors) {
                obj.setErrors(errors)
            }
            obj.setSubmitting(false)
        }

        return <OriginalFormik {...this.props} render={render} onSubmit={onSubmit} />
    }
}

export { default as SemanticFieldWrapper } from './SemanticFieldWrapper'
export { default as SemanticInput } from './SemanticInput'
export { default as SemanticSelect } from './SemanticSelect'
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
