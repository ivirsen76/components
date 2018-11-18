import React from 'react'
import PropTypes from 'prop-types'
import sizeMe from 'react-sizeme'
import style from './style.module.css'

/**
 * The problem with css media queries is that they depend on the screen size.
 * But most of the time we need to create responsive react components
 * based on the container size (for example, the size of a sidebar).
 * This component provides you with the div wrapper where specific size class is applied.
 */
class Component extends React.Component {
    static propTypes = {
        /** @ignore */
        size: PropTypes.object,

        /** @ignore */
        children: PropTypes.node,

        /** Css module stylesheet */
        stylesheet: PropTypes.object.isRequired,

        /** Different classes will be applied based on these breakpoints */
        widthBreakpoints: PropTypes.object,

        /** Show width or not? Useful for demo */
        showWidth: PropTypes.bool,
    }

    static defaultProps = {
        size: {},
        widthBreakpoints: {
            xsmall: 320,
            small: 768,
            medium: 992,
            large: 1200,
        },
        showWidth: false,
    }

    getClassName = () => {
        const { size, stylesheet, widthBreakpoints } = this.props
        const width = size.width || 0
        if (!width || !stylesheet) {
            return null
        }

        let result = ''
        if (width < widthBreakpoints.xsmall) {
            result = stylesheet.xsmall || ''
        } else if (width <= widthBreakpoints.small) {
            result = stylesheet.small || ''
        } else if (width <= widthBreakpoints.medium) {
            result = stylesheet.medium || ''
        } else if (width <= widthBreakpoints.large) {
            result = stylesheet.large || ''
        } else {
            result = stylesheet.huge || ''
        }

        return result
    }

    render() {
        return (
            <div>
                {this.props.showWidth && (
                    <div className={style.width}>Width: {Math.round(this.props.size.width)}px</div>
                )}
                <div className={this.getClassName()}>{this.props.children}</div>
            </div>
        )
    }
}

export default sizeMe({
    refreshRate: 100, // we don't need to refresh page so often (default 16)
})(Component)
