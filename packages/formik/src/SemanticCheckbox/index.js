import React from 'react'
import PropTypes from 'prop-types'
import FieldWrapper from '../SemanticFieldWrapper'

export default class FormikInput extends React.Component {
    static propTypes = {
        field: PropTypes.object,
        form: PropTypes.object,
        label: PropTypes.node,
    }

    onClick = e => {
        e && e.preventDefault()
        this.props.field.onChange({
            target: { ...this.props.field, value: !this.props.field.value },
        })
    }

    render() {
        const { label } = this.props
        const value = !!this.props.field.value

        return (
            <FieldWrapper {...this.props}>
                <div className="ui checkbox">
                    <input
                        type="checkbox"
                        tabIndex="0"
                        className="hidden"
                        checked={value}
                        onChange={this.onClick}
                    />
                    <label onClick={this.onClick}>{label}</label>
                </div>
            </FieldWrapper>
        )
    }
}
