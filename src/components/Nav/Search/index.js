import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

export default class Component extends React.Component {
    static propTypes = {
        search: PropTypes.string,
        setSearch: PropTypes.func,
    }

    setSearch = e => {
        e && e.preventDefault()
        this.props.setSearch(e.target.value)
    }

    onClear = e => {
        this.props.setSearch('')
        this.input.focus()
    }

    render() {
        return (
            <div className="ui icon input">
                <input
                    ref={input => (this.input = input)}
                    type="text"
                    placeholder="Search..."
                    value={this.props.search}
                    onChange={this.setSearch}
                    className={`${this.props.search && style.withData}`}
                />
                {this.props.search ? (
                    <i className="remove icon link" onClick={this.onClear} />
                ) : (
                    <i className="search icon" />
                )}
            </div>
        )
    }
}
