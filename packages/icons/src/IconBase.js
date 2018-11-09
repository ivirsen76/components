import React from 'react'
import PropTypes from 'prop-types'
import style from './IconBase.module.css'

const IconBase = props => {
    const { children, viewBox, spaceRight, spaceLeft } = props

    return (
        <svg
            className={`${style.icon} ${spaceRight && style.spaceRight} ${spaceLeft &&
                style.spaceLeft}`}
            viewBox={viewBox}
            style={props.style}
        >
            {children}
        </svg>
    )
}

IconBase.propTypes = {
    viewBox: PropTypes.string,
    children: PropTypes.node,
    spaceRight: PropTypes.bool,
    spaceLeft: PropTypes.bool,
    style: PropTypes.object,
}

IconBase.defaultProps = {
    viewBox: '0 0 1024 1024',
    spaceRight: false,
    style: {},
}

// module.exports needed to generate right icons
module.exports = IconBase
