import React from 'react'
import PropTypes from 'prop-types'
import _escapeRegExp from 'lodash/escapeRegExp'
import ReactDOMServer from 'react-dom/server'
import striptags from 'striptags'
import style from './style.module.css'

class Component extends React.Component {
    static propTypes = {
        column: PropTypes.string,
        value: PropTypes.string,
        onFilterChange: PropTypes.func,
    }

    onChange = e => {
        this.props.onFilterChange(this.props.column, e.target.value)
    }

    onClear = e => {
        this.props.onFilterChange(this.props.column, '')
    }

    render() {
        return (
            <form className="ui fluid icon input">
                <input
                    value={this.props.value}
                    onChange={this.onChange}
                    className={`${this.props.value && style.filtered}`}
                />
                {this.props.value && <i className="remove icon link" onClick={this.onClear} />}
            </form>
        )
    }
}

export default {
    code: 'text',
    component: Component,
    getFilter: (column, value) => row => {
        const regex = new RegExp(_escapeRegExp(value), 'i')
        const string = React.isValidElement(row[column])
            ? striptags(ReactDOMServer.renderToStaticMarkup(row[column]))
            : row[column]

        return string.match(regex)
    },
}
