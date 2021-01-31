import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const aroundPages = 3
const edgePages = 3
const showAngularLinks = false
const isEdgeLinks = false
const minPages = 10

/** Show page links */
export default class Paginator extends React.Component {
    static propTypes = {
        /** total number of pages. If equal 0 then the component shows nothing */
        total: PropTypes.number,

        /** current page */
        currentPage: PropTypes.number,

        /** function called after changing page with params: function(newPage) */
        onPageChange: PropTypes.func,
    }

    static defaultProps = {
        total: 0,
        currentPage: 1,
        onPageChange() {},
    }

    changePage = page => {
        if (page < 1 || page > this.props.total) {
            return
        }

        this.props.onPageChange(page)
    }

    gotoPage = (page, e) => {
        e.preventDefault()

        if (page < 1 || page > this.props.total) {
            return
        }

        this.changePage(page)
    }

    gotoPrevPage = e => {
        e.preventDefault()
        this.changePage(this.props.currentPage - 1)
    }

    gotoNextPage = e => {
        e.preventDefault()
        this.changePage(this.props.currentPage + 1)
    }

    gotoFirstPage = e => {
        e.preventDefault()
        this.changePage(1)
    }

    gotoLastPage = e => {
        e.preventDefault()
        this.changePage(this.props.total)
    }

    render() {
        const { total, currentPage } = this.props

        // Don't show anything if there is only one page
        if (total <= 1) {
            return null
        }

        const pages = []
        let isGap = false
        for (let i = 1; i <= total; i++) {
            // Don't show gap pages
            if (
                total > minPages &&
                Math.abs(i - currentPage) > aroundPages &&
                Math.abs(i) > edgePages &&
                Math.abs(total - i) >= edgePages
            ) {
                if (!isGap) {
                    pages.push(
                        <div key={i} className="page-item disabled">
                            <span className="page-link">...</span>
                        </div>
                    )
                    isGap = true
                }
            } else {
                isGap = false

                pages.push(
                    <div key={i} className={classnames({ active: i === currentPage }, 'page-item')}>
                        <a className="page-link" onClick={this.gotoPage.bind(this, i)}>
                            {i}
                        </a>
                    </div>
                )
            }
        }

        // Prev and next pages
        if (showAngularLinks) {
            // Prev page
            pages.unshift(
                <div
                    key="prev"
                    className={classnames({ disabled: currentPage === 1 }, 'page-item')}
                >
                    <a className="page-link" onClick={this.gotoPrevPage}>
                        «
                    </a>
                </div>
            )

            // Next page
            pages.push(
                <div
                    key="next"
                    className={classnames({ disabled: currentPage === total }, 'page-item')}
                >
                    <a className="page-link" onClick={this.gotoNextPage}>
                        »
                    </a>
                </div>
            )
        }

        // First and last pages
        if (isEdgeLinks) {
            // First page
            pages.unshift(
                <div
                    key="first"
                    className={classnames({ disabled: currentPage === 1 }, 'page-item')}
                >
                    <a className="page-link" onClick={this.gotoFirstPage}>
                        First
                    </a>
                </div>
            )

            // Last page
            pages.push(
                <div
                    key="last"
                    className={classnames({ disabled: currentPage === total }, 'page-item')}
                >
                    <a className="page-link" onClick={this.gotoLastPage}>
                        Last
                    </a>
                </div>
            )
        }

        return <div className="pagination">{pages}</div>
    }
}
