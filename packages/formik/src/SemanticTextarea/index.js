import React from 'react'
import PropTypes from 'prop-types'
import _pick from 'lodash/pick'
import FieldWrapper from '../SemanticFieldWrapper'

export default class FormikInput extends React.Component {
    static propTypes = {
        field: PropTypes.object,
        form: PropTypes.object,
        label: PropTypes.node,
    }

    render() {
        const { label, field } = this.props
        const props = _pick(this.props, ['style'])

        return (
            <FieldWrapper {...this.props}>
                {label && <label htmlFor={field.name}>{label}</label>}
                <textarea {...field} {...props} />
            </FieldWrapper>
        )
    }
}
