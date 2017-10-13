import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class Paginator extends React.Component {
    static propTypes = {
        total: PropTypes.number,
        currentPage: PropTypes.number,
        aroundPages: PropTypes.number,
        edgePages: PropTypes.number,
        showAngularLinks: PropTypes.bool,
        isEdgeLinks: PropTypes.bool,
        minPages: PropTypes.number,
        onPageChange: PropTypes.func,
    }

    static defaultProps = {
        // total number of pages. If equal 0 then the component shows nothing
        total: 0,

        // current page
        currentPage: 1,

        // minimum number of pages around the current page
        aroundPages: 3,

        // minimum number of pages at the beggining and at the end
        edgePages: 3,

        // show "Next" and "Prev" links or not?
        showAngularLinks: true,

        // show "First" and "Last" links or not?
        isEdgeLinks: true,

        // minimum number of pages which will not be splitted
        minPages: 10,

        // function called after changing page.
        // with params: function(newPage)
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
        const {
            total,
            minPages,
            currentPage,
            aroundPages,
            edgePages,
            showAngularLinks,
            isEdgeLinks,
        } = this.props

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
                    pages.push(<div key={i} className="disabled item">...</div>)
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
                    First
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

        return (
            <div className="ui pagination tiny menu">
                {pages}
            </div>
        )
    }
}
