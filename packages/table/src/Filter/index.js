import PropTypes from 'prop-types'
import React from 'react'
import FilterText from './FilterText'
import FilterSelectbox from './FilterSelectbox'

export const filters = [FilterText, FilterSelectbox]

export default class Filter extends React.Component {
    static propTypes = {
        column: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.bool,
            PropTypes.array,
        ]),
        onFilterChange: PropTypes.func,
        settings: PropTypes.object,
    }

    static defaultProps = {
        settings: { type: 'text' },
    }

    render() {
        const filter = filters.find(item => item.code === this.props.settings.type)

        if (!filter) {
            console.error(`There is no "${this.props.settings.type}" filter type`)
            return null
        }

        return <filter.component {...this.props} />
    }
}
