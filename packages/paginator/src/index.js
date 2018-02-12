import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const aroundPages = 3
const edgePages = 3
const showAngularLinks = true
const isEdgeLinks = true
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
                        <div key={i} className="disabled item">
                            ...
                        </div>
                    )
                    isGap = true
                }
            } else {
                isGap = false

                pages.push(
                    <a
                        key={i}
                        className={classnames({ active: i === currentPage }, 'item')}
                        onClick={this.gotoPage.bind(this, i)}
                    >
                        {i}
                    </a>
                )
            }
        }

        // Prev and next pages
        if (showAngularLinks) {
            // Prev page
            pages.unshift(
                <a
                    key="prev"
                    className={classnames({ disabled: currentPage === 1 }, 'item')}
                    onClick={this.gotoPrevPage}
                >
                    «
                </a>
            )

            // Next page
            pages.push(
                <a
                    key="next"
                    className={classnames({ disabled: currentPage === total }, 'item')}
                    onClick={this.gotoNextPage}
                >
                    »
                </a>
            )
        }

        // First and last pages
        if (isEdgeLinks) {
            // First page
            pages.unshift(
                <a
                    key="first"
                    className={classnames({ disabled: currentPage === 1 }, 'item')}
                    onClick={this.gotoFirstPage}
                >
                    First one
                </a>
            )

            // Last page
            pages.push(
                <a
                    key="last"
                    className={classnames({ disabled: currentPage === total }, 'item')}
                    onClick={this.gotoLastPage}
                >
                    Last
                </a>
            )
        }

        return <div className="ui pagination tiny menu">{pages}</div>
    }
}
