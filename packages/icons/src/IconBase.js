import React from 'react'
import PropTypes from 'prop-types'
import style from './IconBase.module.css'

// module.exports needed to generate right icons
module.exports = class IconBase extends React.Component {
    static propTypes = {
        viewBox: PropTypes.string,
        children: PropTypes.node,
        spaceRight: PropTypes.bool,
        spaceLeft: PropTypes.bool,
        style: PropTypes.object,
    }

    static defaultProps = {
        viewBox: '0 0 1024 1024',
        spaceRight: false,
        style: {},
    }

    render() {
        const { children, viewBox, spaceRight, spaceLeft } = this.props

        return (
            <svg
                className={`${style.icon} ${spaceRight && style.spaceRight} ${spaceLeft &&
                    style.spaceLeft}`}
                viewBox={viewBox}
                style={this.props.style}
            >
                {children}
            </svg>
        )
    }
}
