import React from 'react'
import PropTypes from 'prop-types'

class Component extends React.Component {
    static propTypes = {
        column: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        onFilterChange: PropTypes.func,
        settings: PropTypes.object,
    }

    getOptions = () =>
        this.props.settings.options.map(option => ({
            ...option,
            stringValue: option.value.toString(),
        }))

    onChange = event => {
        let value = event.target.value
        if (value !== '') {
            const selectedOption = this.getOptions().find(option => option.stringValue === value)
            if (!selectedOption) {
                console.error('Something wrong with the filter')
            }

            value = selectedOption.value
        }

        this.props.onFilterChange(this.props.column, value)
    }

    render() {
        const value = typeof this.props.value === 'undefined' ? '' : this.props.value.toString()

        return (
            <form className="ui form">
                <select className="ui fluid dropdown" value={value} onChange={this.onChange}>
                    <option value="">&nbsp;</option>
                    {this.getOptions().map(option => (
                        <option key={option.stringValue} value={option.stringValue}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </form>
        )
    }
}

export default {
    code: 'selectbox',
    component: Component,
    getFilter: (column, value) => row => row[column] === value,
}
