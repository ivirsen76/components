import React from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import tippy from 'tippy.js'
import './tippy.css'

/** Tooltip */
export default class Tippy extends React.Component {
    static propTypes = {
        /** Title to show on the tooltip */
        title: PropTypes.node,

        children: PropTypes.node,
    }

    static defaultProps = {
        title: '',
    }

    componentDidMount() {
        this.generateTippy()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.title !== this.props.title) {
            this.generateTippy()
        }
    }

    componentWillUnmount() {
        this.removeTippy()
    }

    generateTippy() {
        this.removeTippy()

        const content = React.isValidElement(this.props.title)
            ? ReactDOMServer.renderToStaticMarkup(this.props.title)
            : this.props.title

        this.tippyInstance = tippy.one(ReactDOM.findDOMNode(this), {
            content,
            arrow: true,
            placement: 'top',
            size: '',
        })
    }

    removeTippy() {
        if (this.tippyInstance) {
            this.tippyInstance.destroy()
            this.tippyInstance = null
        }
    }

    render() {
        return <span>{this.props.children}</span>
    }
}
