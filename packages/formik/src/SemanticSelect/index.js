import React from 'react'
import PropTypes from 'prop-types'
import FieldWrapper from '../SemanticFieldWrapper'

export default class FormikInput extends React.Component {
    static propTypes = {
        field: PropTypes.object,
        form: PropTypes.object,
        label: PropTypes.node,
        options: PropTypes.array.isRequired,
        type: PropTypes.string,
    }

    static defaultProps = {
        type: 'selectbox',
    }

    onChange = (value, e) => {
        e && e.preventDefault()
        this.props.field.onChange({ target: { name: this.props.field.name, value } })
    }

    render() {
        const { type, label, options } = this.props
        const field = {
            ...this.props.field,
            ...(!this.props.field.value && { value: '' }),
        }

        return (
            <FieldWrapper {...this.props}>
                {label && <label htmlFor={field.name}>{label}</label>}
                {type === 'selectbox' && (
                    <select className="ui dropdown" {...field}>
                        {options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}
                {type === 'button' && (
                    <div className="ui buttons">
                        {options.map(option => (
                            <button
                                className={`compact ui ${field.value === option.value &&
                                    'active'} button`}
                                key={option.value}
                                onClick={this.onChange.bind(this, option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </FieldWrapper>
        )
    }
}
