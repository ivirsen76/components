import React from 'react'
import PropTypes from 'prop-types'
import Paginator from '@ieremeev/paginator'
import md5 from 'md5'
import storage from 'store'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _escapeRegExp from 'lodash/escapeRegExp'
import _sortBy from 'lodash/sortBy'
import _isEqual from 'lodash/isEqual'
import _pick from 'lodash/pick'
import style from './Table.module.scss'
import Filter from './Filter'
import Sortable from './Sortable'

/** Table component */
export default class Table extends React.Component {
    static propTypes = {
        /** unique name for the table */
        name: PropTypes.string,

        /** Class for the <table /> */
        className: PropTypes.string,

        /**
         * Array of columns. For example:
         * [
         *     { name: 'id', label: 'ID' },
         *     { name: 'name', label: 'Name', sort: true, filter: true },
         *     { name: 'email', label: 'Email', sort: true, filter: true },
         * ]
         */
        columns: PropTypes.array,

        /**
         * Array of data. For example:
         * [
         *     { id: 1, name: 'Mike', email: 'mike@gmail.com' },
         *     { id: 2, name: 'Helen', email: 'helen@gmail.com' },
         *     { id: 3, name: 'Bob', email: 'bob@gmail.com' },
         * ]
         */
        data: PropTypes.array,

        /** Show row number or not? */
        showRowNumber: PropTypes.bool,

        /** Default number of rows per one page */
        perPage: PropTypes.number,

        /** Show a paginator below the table or not? */
        hideBottomPaginator: PropTypes.bool,

        /** Message shown when there is no data to show */
        noDataMessage: PropTypes.string,
    }

    static defaultProps = {
        name: 'table',
        className: 'ui compact table',
        columns: [],
        data: [],
        showRowNumber: false,
        perPage: 50,
        hideBottomPaginator: false,
        noDataMessage: 'There is no data',
    }

    constructor(props) {
        super(props)

        this.state = {
            currentPage: 1,
            filters: {},
            orderBy: '',
            isAscentOrder: true,
            ...this.getSettings(),
        }
    }

    componentDidUpdate() {
        this.saveSettings()
    }

    getHash = () => {
        // Generate unique hash for the page+table
        let str =
            window.location.hostname +
            window.location.pathname +
            this.props.name +
            this.props.columns.map(column => column.name).toString()
        let hash = md5(str)

        return 'table_' + hash
    }

    getSettings = () => {
        let settings = storage.get(this.getHash())
        if (!settings) {
            return {}
        }

        return _pick(settings, ['filters', 'orderBy', 'isAscentOrder'])
    }

    saveSettings = () => {
        const hash = this.getHash()
        const oldSettings = storage.get(hash)
        const newSettings = _pick(this.state, ['filters', 'orderBy', 'isAscentOrder'])

        if (!_isEqual(oldSettings, newSettings)) {
            storage.set(hash, newSettings)
        }
    }

    getStartRowNumber = () => (this.state.currentPage - 1) * this.props.perPage

    getFilteredData = () => {
        let rows = this.props.data

        // Apply filters
        this.props.columns.forEach(column => {
            const filterValue = this.state.filters[column.name]
            if (!column.filter || !filterValue) {
                return
            }

            const regex = new RegExp(_escapeRegExp(filterValue), 'i')
            rows = _filter(rows, row => row[column.name] && row[column.name].match(regex))
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
        const filters = this.state.filters
        if (value === '') {
            delete filters[column]
        } else {
            filters[column] = value
        }

        this.setState({ currentPage: 1, filters })
    }

    onOrder = orderBy => {
        const isAscentOrder =
            this.state.orderBy === orderBy ? !this.state.isAscentOrder : this.state.isAscentOrder

        this.setState({
            currentPage: 1,
            orderBy,
            isAscentOrder,
        })
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
            <thead className={this.hasFilters() && style.hasFilters}>
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

            return (
                <th key={column.name}>
                    <Filter
                        column={column.name}
                        value={this.state.filters[column.name] || ''}
                        onFilterChange={this.onFilterChange}
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
