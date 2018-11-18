import React from 'react'
import PropTypes from 'prop-types'
import { Formik as OriginalFormik } from 'formik'
import Sync from './sync.js'

/** Wrapper for Formik package */
export const Formik = class Formik extends React.Component {
    static propTypes = {
        onValidChange: PropTypes.func,
        render: PropTypes.func,
        onSubmit: PropTypes.func,
        prepareValues: PropTypes.func,
    }

    prepareValues = values => (this.props.prepareValues ? this.props.prepareValues(values) : values)

    render() {
        let render = this.props.render
        if (this.props.onValidChange && this.props.render) {
            render = args => (
                <div>
                    <Sync
                        {...args}
                        prepareValues={this.prepareValues}
                        update={this.props.onValidChange}
                    />
                    {this.props.render(args)}
                </div>
            )
        }

        const onSubmit = async (values, obj) => {
            try {
                await this.props.onSubmit(this.prepareValues(values), obj)
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
export { default as SemanticCheckbox } from './SemanticCheckbox'
export { default as SemanticTextarea } from './SemanticTextarea'
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
