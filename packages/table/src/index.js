import React from 'react'
import PropTypes from 'prop-types'
import Paginator from '@ieremeev/paginator'
import md5 from 'md5'
import storage from 'store'
import _find from 'lodash/find'
import _sortBy from 'lodash/sortBy'
import _isEqual from 'lodash/isEqual'
import _pick from 'lodash/pick'
import classnames from 'classnames'
import style from './style.module.scss'
import Filter, { filters as allFilters } from './Filter'
import Sortable from './Sortable'

/** HTML table with sorting and filtering */
export default class Table extends React.Component {
    storageKey = '@ieremeev/table'

    static propTypes = {
        /** Unique name for the table */
        name: PropTypes.string,

        /** Class for the table wrapper */
        className: PropTypes.string,

        /**
         * Array of columns. For example:
         * <pre>
         * [
         *     { name: 'id', label: 'ID' },
         *     { name: 'name', label: 'Name', sort: true, filter: true },
         *     { name: 'email', label: 'Email', sort: true, filter: true },
         * ]
         * </pre>
         */
        columns: PropTypes.array,

        /**
         * Array of data. For example:
         * <pre>
         * [
         *     { id: 1, name: 'Mike', email: 'mike@gmail.com' },
         *     { id: 2, name: 'Helen', email: 'helen@gmail.com' },
         *     { id: 3, name: 'Bob', email: 'bob@gmail.com' },
         * ]
         * </pre>
         */
        data: PropTypes.array,

        /** Show row number or not? */
        showRowNumber: PropTypes.bool,

        /** Column name that is used for default sorting */
        orderBy: PropTypes.string,

        /** Use ascending order or not? */
        isAscentOrder: PropTypes.bool,

        /** Default number of rows per one page */
        perPage: PropTypes.number,

        /** Show a paginator below the table or not? */
        hideBottomPaginator: PropTypes.bool,

        /** Message shown when there is no data to show */
        noDataMessage: PropTypes.string,

        /** Save sort/filter settings or not? */
        saveSettings: PropTypes.bool,
    }

    static defaultProps = {
        name: 'table',
        className: 'ui unstackable compact table',
        columns: [],
        data: [],
        showRowNumber: false,
        perPage: 50,
        hideBottomPaginator: false,
        noDataMessage: 'There is no data',
        saveSettings: false,
    }

    constructor(props) {
        super(props)

        this.state = {
            currentPage: 1,
            filters: {},
            orderBy: props.orderBy || '',
            isAscentOrder: !props.isAscentOrder === false,
            ...this.getSettings(),
        }
    }

    componentDidUpdate() {
        this.saveSettings()
    }

    getHash = () => {
        // Generate unique hash for the page+table
        const str =
            window.location.hostname +
            window.location.pathname +
            this.props.name +
            this.props.columns.map(column => column.name).toString()

        return md5(str).substr(0, 10)
    }

    getSettings = () => {
        if (!this.props.saveSettings) {
            return {}
        }

        const hash = this.getHash()
        const settings = (storage.get(this.storageKey) || {})[hash]
        if (!settings) {
            return {}
        }

        return _pick(settings, ['filters', 'orderBy', 'isAscentOrder'])
    }

    saveSettings = () => {
        if (!this.props.saveSettings) {
            return
        }

        const hash = this.getHash()
        const allSettings = storage.get(this.storageKey) || {}
        const oldSettings = _pick(allSettings[hash], ['filters', 'orderBy', 'isAscentOrder'])
        const newSettings = _pick(this.state, ['filters', 'orderBy', 'isAscentOrder'])

        if (_isEqual(oldSettings, newSettings)) {
            return
        }

        storage.set(this.storageKey, {
            ...allSettings,
            [hash]: newSettings,
        })
    }

    getStartRowNumber = () => (this.state.currentPage - 1) * this.props.perPage

    getFilteredData = () => {
        let rows = this.props.data

        // Apply filters
        this.props.columns.forEach(column => {
            const filterValue = this.state.filters[column.name]
            if (!column.filter || typeof filterValue === 'undefined' || filterValue === '') {
                return
            }

            const type = (column.filterSettings && column.filterSettings.type) || 'text'
            const { getFilter } = allFilters.find(item => item.code === type)
            if (!getFilter) {
                throw new Error(`No getFilter() for filter type "${type}"`)
            }

            rows = rows.filter(getFilter(column.name, filterValue))
        })

        // Apply an order
        if (this.state.orderBy !== '') {
            const column = _find(this.props.columns, { name: this.state.orderBy })

            // Check if the column hasn't been removed
            if (column) {
                rows = _sortBy(rows, this.state.orderBy)

                if (!this.state.isAscentOrder) {
                    rows.reverse()
                }
            }
        }

        return rows
    }

    getPageRows = () => {
        const start = this.getStartRowNumber()
        const end = this.state.currentPage * this.props.perPage

        return this.getFilteredData().slice(start, end)
    }

    getFilteredTotal = () => this.getFilteredData().length

    getTotal = () => this.props.data.length

    hasFilters = () => !!_find(this.props.columns, { filter: true })

    gotoPage = page => {
        this.setState({
            currentPage: page,
        })
    }

    onFilterChange = (column, value) => {
        this.setState(state => {
            const filters = { ...state.filters }
            if (value === '') {
                delete filters[column]
            } else {
                filters[column] = value
            }

            return { currentPage: 1, filters }
        })
    }

    onOrder = orderBy => {
        this.setState(state => ({
            currentPage: 1,
            orderBy,
            isAscentOrder: state.orderBy === orderBy ? !state.isAscentOrder : state.isAscentOrder,
        }))
    }

    renderPaginator = () => {
        const total = Math.ceil(this.getFilteredTotal() / this.props.perPage)

        if (total <= 1) {
            return null
        }

        return (
            <Paginator
                total={total}
                currentPage={this.state.currentPage}
                onPageChange={this.gotoPage}
            />
        )
    }

    renderThead = () => {
        const { columns, showRowNumber } = this.props

        const list = columns.map(column => {
            if (!column.sort) {
                return <th key={column.name}>{column.label}</th>
            }

            let sortable = <Sortable />
            if (column.name === this.state.orderBy) {
                sortable = this.state.isAscentOrder ? (
                    <Sortable order="asc" />
                ) : (
                    <Sortable order="desc" />
                )
            }

            return (
                <th
                    className={style.sortable}
                    key={column.name}
                    onClick={this.onOrder.bind(this, column.name)}
                >
                    {column.label}
                    {sortable}
                </th>
            )
        })

        // Is Number?
        if (showRowNumber) {
            list.unshift(
                <th key="number_column" className={style.numberColumn}>
                    #
                </th>
            )
        }

        return (
            <thead className={classnames({ [style.hasFilters]: this.hasFilters() })}>
                <tr>{list}</tr>
                {this.renderFilter()}
            </thead>
        )
    }

    renderFilter = () => {
        const { columns, showRowNumber } = this.props

        if (!this.hasFilters()) {
            return null
        }

        const filters = columns.map(column => {
            if (!column.filter) {
                return <th key={column.name} />
            }

            const value =
                typeof this.state.filters[column.name] !== 'undefined'
                    ? this.state.filters[column.name]
                    : ''

            return (
                <th key={column.name}>
                    <Filter
                        column={column.name}
                        value={value}
                        onFilterChange={this.onFilterChange}
                        settings={column.filterSettings}
                    />
                </th>
            )
        })

        if (showRowNumber) {
            filters.unshift(<th key="number_column" />)
        }

        return <tr>{filters}</tr>
    }

    renderTbody = () => {
        const { columns, showRowNumber, noDataMessage } = this.props
        const start = this.getStartRowNumber()

        let rows = this.getPageRows()
        if (rows.length === 0) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={100}>{noDataMessage}</td>
                    </tr>
                </tbody>
            )
        }

        rows = rows.map((row, index) => {
            const list = columns.map(column => (
                <td key={column.name} className={column.className}>
                    {column.render ? column.render(row[column.name], row) : row[column.name]}
                </td>
            ))

            // Is Number?
            if (showRowNumber) {
                list.unshift(
                    <td key="number_column" className={style.numberColumn}>
                        {start + index + 1}
                    </td>
                )
            }

            return <tr key={row.id}>{list}</tr>
        })

        return <tbody>{rows}</tbody>
    }

    render() {
        const { className, hideBottomPaginator } = this.props
        const paginator = this.renderPaginator()

        return (
            <div>
                {paginator}
                <table className={className}>
                    {this.renderThead()}
                    {this.renderTbody()}
                </table>
                {!hideBottomPaginator && paginator}
            </div>
        )
    }
}
