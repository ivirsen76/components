import PropTypes from 'prop-types'
import React from 'react'
import { DropTarget } from 'react-dnd'
import _isEqual from 'lodash/isEqual'
import _pick from 'lodash/pick'

import style from './style.css'

let target = {
    hover(props, monitor, component) {
        const { firstElementId, hoverElement } = props

        const hoveredElement = {
            id: firstElementId,
            top: true,
            middle: false,
            bottom: false,
        }

        const prevHoveredElement = _pick(props.hoveredElement, ['id', 'top', 'middle', 'bottom'])
        if (!_isEqual(prevHoveredElement, hoveredElement)) {
            hoverElement(hoveredElement)
        }
    },
}

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    }
}

class Element extends React.Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        dragDropType: PropTypes.string,
        firstElementId: PropTypes.number,
        hoverElement: PropTypes.func,
        hoveredElement: PropTypes.object,
    }

    render() {
        const { connectDropTarget } = this.props

        return connectDropTarget(<div className={style.firstElement} />)
    }
}

export default DropTarget(props => props.dragDropType, target, collectTarget)(Element)
