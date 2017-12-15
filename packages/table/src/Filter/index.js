import React from 'react'
import PropTypes from 'prop-types'

export default class Filter extends React.Component {
    static propTypes = {
        column: PropTypes.string,
        value: PropTypes.string,
        onFilterChange: PropTypes.func,
    }

    onChange = e => {
        this.props.onFilterChange(this.props.column, e.target.value)
    }

    render() {
        return (
            <form className="ui tiny form">
                <input value={this.props.value} onChange={this.onChange} />
            </form>
        )
    }
}
