import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import { DropTarget } from 'react-dnd'
import _forEach from 'lodash/forEach'
import _without from 'lodash/without'
import _union from 'lodash/union'
import _filter from 'lodash/filter'
import Element from './element.js'
import {
    getAdjustedTree,
    getPlaceholderPosition,
    getFirstElementId,
    getLastElementId,
} from './selectors/builder.js'
import { COLLAPSED_ICON_INDENTATION, PLACEHOLDER_DOT_INDENTATION, STORAGE_KEY } from './config.js'
import FirstElement from './FirstElement.js'
import LastElement from './LastElement.js'
import storage from 'store'
import md5 from 'md5'
import style from './style.module.css'

const target = {
    hover(props, monitor, component) {
        const TREE_INDENTATION = component.props.indentSize

        // Determine rectangle on screen
        let hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect()

        // Determine mouse position
        let clientOffset = monitor.getClientOffset()
        let hoverClientX = clientOffset.x - hoverBoundingRect.left - component._getCollapsedIndent()
        let leftHover = clientOffset.x - hoverBoundingRect.left

        const level = Math.max(Math.floor(hoverClientX / TREE_INDENTATION) + 1, 1)

        // Check if we need to show placeholder
        const showPlaceholder = leftHover > PLACEHOLDER_DOT_INDENTATION
        if (showPlaceholder !== component.state.showPlaceholder) {
            component.setState({
                showPlaceholder,
            })
        }

        // Check if we hovered element is changed
        const prevLevel = component.state.hoveredElement.level
        if (prevLevel !== level) {
            component._hoverElement({
                level,
            })
        }
    },
    drop(props, monitor, component) {
        let item = monitor.getItem()
        const { placeholderBefore, placeholderParentId } = component._getPlaceholderPosition()
        props.onDrop(item.element, placeholderParentId, placeholderBefore)
    },
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }
}

/** drag-and-drop target list where you can add and nest items */
export class Component extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        tree: PropTypes.object.isRequired,
        dragDropType: PropTypes.string.isRequired,
        dragDropCode: PropTypes.string,
        onDrop: PropTypes.func.isRequired,

        /** Indent size for the next level */
        indentSize: PropTypes.number,

        dragDropHint: PropTypes.string,
        wrapperStyle: PropTypes.object,
        showBottomMargin: PropTypes.bool,
    }

    static defaultProps = {
        name: 'Tree',
        indentSize: 40,
        dragDropCode: null,
        dragDropHint: 'Drag elements here',
        wrapperStyle: {},
        showBottomMargin: true,
    }

    constructor(props) {
        super(props)

        this.state = {
            draggedElementId: -1,
            hoveredElement: {
                id: 0,
                top: false,
                middle: false,
                bottom: false,
                level: 1,
            },
            collapsedElements: [],
            showPlaceholder: false,
            ...this._getSavedState(),
        }
    }

    componentDidMount() {
        this._mounted = true
    }

    componentWillUnmount() {
        this._mounted = false
    }

    componentDidUpdate(prevProps) {
        if (!this.props.isOver && prevProps.isOver) {
            // Hack! SetTimout allows onDrop handles the correct hoveredElement before resetting
            setTimeout(() => {
                this._resetHoveredElement()
            }, 200)
        }
    }

    _getCollapsedIndent = () => {
        const { tree } = this.props

        if (!tree.children || tree.children.length === 0) {
            return 0
        }

        if (_filter(tree.children, { isAdult: true }).length > 0) {
            return COLLAPSED_ICON_INDENTATION
        }

        return 0
    }

    _getReselectState = () => ({
        tree: this.props.tree,
        ...this.state,
    })

    _getCode = () => md5((this.props.dragDropCode || this.props.dragDropType) + this.props.name)

    _getSavedState = () => {
        const savedState = storage.get(STORAGE_KEY) || {}
        return savedState[this._getCode()] || {}
    }

    _saveState = () => {
        const savedState = storage.get(STORAGE_KEY) || {}

        storage.set(STORAGE_KEY, {
            ...savedState,
            [this._getCode()]: {
                collapsedElements: this.state.collapsedElements,
            },
        })
    }

    _toggleCollapsedElementState = elementId => {
        const collapsedElements = this.state.collapsedElements.includes(elementId)
            ? _without(this.state.collapsedElements, elementId)
            : _union(this.state.collapsedElements, [elementId])

        this.setState(
            {
                collapsedElements,
            },
            this._saveState
        )
    }

    _hoverElement = element => {
        if (element.id !== 0 && element.id === this.state.draggedElementId) {
            return
        }

        this.setState({
            hoveredElement: {
                ...this.state.hoveredElement,
                ...element,
            },
        })
    }

    _resetHoveredElement = () => {
        this.setState({
            hoveredElement: {
                id: 0,
                top: false,
                middle: false,
                bottom: false,
                level: 1,
            },
        })
    }

    _setDraggedElement = elementId => {
        this.setState({
            draggedElementId: elementId,
        })
    }

    _resetDraggedElement = () => {
        if (this._mounted) {
            this.setState({
                draggedElementId: -1,
            })
        }
    }

    _getPlaceholderPosition = () => getPlaceholderPosition(this._getReselectState())

    _getPlaceholder = (level = 0) => (
        <div
            key="placeholder"
            className={style.placeholder}
            style={{
                marginLeft: `${(level - 1) * this.props.indentSize + this._getCollapsedIndent()}px`,
            }}
        />
    )

    _getElements = list => {
        const { placeholderBefore, placeholderParentId } = this._getPlaceholderPosition()
        let result = []

        _forEach(list.children, element => {
            if (
                this.props.isOver &&
                this.state.showPlaceholder &&
                element.id === placeholderBefore &&
                element.parents[0] === placeholderParentId
            ) {
                result.push(this._getPlaceholder(element.level))
            }

            const isCollapsed = this.state.collapsedElements.includes(element.id)
            result.push(
                <Element
                    key={element.id}
                    element={element}
                    dragDropType={this.props.dragDropType}
                    indentSize={this.props.indentSize}
                    isCollapsed={isCollapsed}
                    setDraggedElement={this._setDraggedElement}
                    resetDraggedElement={this._resetDraggedElement}
                    hoveredElement={this.state.hoveredElement}
                    hoverElement={this._hoverElement}
                    toggleCollapsedElementState={this._toggleCollapsedElementState}
                    collapsedIndent={this._getCollapsedIndent()}
                    isPlaceholderParent={placeholderParentId === element.id}
                />
            )

            if (element.isAdult && !isCollapsed) {
                result.push(<div key={element.id + 'children'}>{this._getElements(element)}</div>)
            }
        })

        if (
            this.props.isOver &&
            this.state.showPlaceholder &&
            placeholderBefore === 0 &&
            placeholderParentId === list.id
        ) {
            result.push(this._getPlaceholder(list.level + 1))
        }

        return result
    }

    render() {
        let { connectDropTarget, wrapperStyle, showBottomMargin } = this.props

        const elements = this._getElements(getAdjustedTree(this._getReselectState()))
        const firstElementId = getFirstElementId(this._getReselectState())
        const lastElementId = getLastElementId(this._getReselectState())

        return connectDropTarget(
            <div className={style.listWrapper} style={wrapperStyle}>
                {elements.length > 0 ? (
                    <div style={{ paddingBottom: '3px' }}>
                        <FirstElement
                            dragDropType={this.props.dragDropType}
                            firstElementId={firstElementId}
                            hoverElement={this._hoverElement}
                            hoveredElement={this.state.hoveredElement}
                        />
                        {elements}
                        {showBottomMargin && (
                            <LastElement
                                dragDropType={this.props.dragDropType}
                                hoverElement={this._hoverElement}
                                lastElementId={lastElementId}
                                hoveredElement={this.state.hoveredElement}
                            />
                        )}
                    </div>
                ) : (
                    <div className={style.dragDropHint}>{this.props.dragDropHint}</div>
                )}
            </div>
        )
    }
}

export default DropTarget(props => props.dragDropType, target, collect)(Component)
