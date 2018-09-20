import PropTypes from 'prop-types'
import React from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import ReactDOM from 'react-dom'
import _isEqual from 'lodash/isEqual'
import _forEach from 'lodash/forEach'
import _pick from 'lodash/pick'
import { HOVER_EXPAND_WAITING } from './config.js'

import style from './style.css'

let timeouts = {}
const clearTimeouts = () => {
    // Clear all timeouts
    _forEach(timeouts, (timeout, key) => {
        clearTimeout(timeout)
        delete timeouts[key]
    })
}

let source = {
    beginDrag(props, monitor, component) {
        props.setDraggedElement(props.element.id)

        return {
            element: props.element,
        }
    },
    endDrag(props, monitor, component) {
        props.resetDraggedElement()
    },
}

let target = {
    hover(props, monitor, component) {
        const { element, toggleCollapsedElementState } = props

        // Determine rectangle on screen
        let hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect()

        // Get horizontal middle
        let hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
        let hoverLowQuarterY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 4
        let hoverHighQuarterY = (hoverBoundingRect.bottom - hoverBoundingRect.top) * 3 / 4

        // Determine mouse position
        let clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        let hoverClientY = clientOffset.y - hoverBoundingRect.top

        const middle = hoverClientY >= hoverLowQuarterY && hoverClientY <= hoverHighQuarterY

        const hoveredElement = {
            id: element.id,
            top: hoverClientY < hoverMiddleY,
            middle,
            bottom: hoverClientY >= hoverMiddleY,
        }

        const prevHoveredElement = _pick(props.hoveredElement, ['id', 'top', 'middle', 'bottom'])
        if (!_isEqual(prevHoveredElement, hoveredElement)) {
            props.hoverElement(hoveredElement)
        }

        if (props.isCollapsed) {
            if (middle && !timeouts[element.id]) {
                timeouts[element.id] = setTimeout(() => {
                    toggleCollapsedElementState(element.id)
                }, HOVER_EXPAND_WAITING)
            }
            if (!middle) {
                clearTimeouts()
            }
        }
    },
    drop(props, monitor, component) {
        clearTimeouts()
    },
}

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    }
}

function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
    }
}

class Element extends React.Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        connectDragSource: PropTypes.func.isRequired,
        connectDragPreview: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        element: PropTypes.object,
        indentSize: PropTypes.number,
        isCollapsed: PropTypes.bool,
        hoveredElement: PropTypes.object,
        hoverElement: PropTypes.func,
        setDraggedElement: PropTypes.func,
        resetDraggedElement: PropTypes.func,
        toggleCollapsedElementState: PropTypes.func,
        collapsedIndent: PropTypes.number,
        isPlaceholderParent: PropTypes.bool,
    }

    _toggleCollapsedElementState = () => {
        this.props.toggleCollapsedElementState(this.props.element.id)
    }

    _getElement = () => {
        const {
            element,
            isDragging,
            isCollapsed,
            connectDragSource,
            collapsedIndent,
            isPlaceholderParent,
        } = this.props

        if (isDragging) {
            return null
        }

        return (
            <div style={{ paddingLeft: `${(element.level - 1) * this.props.indentSize}px` }}>
                {connectDragSource(
                    <div
                        className={style.elementWrapper}
                        style={{ marginLeft: `${collapsedIndent}px` }}
                    >
                        {element.isAdult &&
                            element.children &&
                            element.children.length > 0 && (
                                <div
                                    className={style.collapsed}
                                    onClick={this._toggleCollapsedElementState}
                                >
                                    <i
                                        className={`glyphicon glyphicon-triangle-${
                                            isCollapsed ? 'right' : 'bottom'
                                        }`}
                                    />
                                </div>
                            )}
                        {element.isAdult &&
                            (!element.children || element.children.length === 0) && (
                                <div className={style.collapsed + ' ' + style.disabled}>
                                    <i className={'glyphicon glyphicon-triangle-bottom'} />
                                </div>
                            )}
                        <div className={isPlaceholderParent && style.placeholderParent}>
                            {element.component}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    render() {
        const { connectDropTarget, connectDragPreview } = this.props

        return connectDropTarget(
            <div style={{ position: 'relative' }}>
                {connectDragPreview(<span />)}
                {this._getElement()}
            </div>
        )
    }
}

export default DropTarget(props => props.dragDropType, target, collectTarget)(
    DragSource(props => props.dragDropType, source, collectSource)(Element)
)
