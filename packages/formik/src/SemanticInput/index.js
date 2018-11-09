import React from 'react'
import PropTypes from 'prop-types'
import FieldWrapper from '../SemanticFieldWrapper'
import _pick from 'lodash/pick'

export default class FormikInput extends React.Component {
    static propTypes = {
        field: PropTypes.object,
        form: PropTypes.object,
        label: PropTypes.node,
        type: PropTypes.string,
    }

    static defaultProps = {
        type: 'text',
    }

    render() {
        const { label } = this.props
        const props = _pick(this.props, ['autoFocus', 'type', 'style', 'id'])
        const field = {
            ...this.props.field,
            ...(!this.props.field.value && { value: '' }),
        }

        return (
            <FieldWrapper {...this.props}>
                {label && <label htmlFor={field.name}>{label}</label>}
                <input {...field} {...props} />
            </FieldWrapper>
        )
    }
}
