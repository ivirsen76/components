import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { DropTarget } from 'react-dnd';
import _isEqual from 'lodash/isEqual';
import _pick from 'lodash/pick';

import style from './style.css';

var target = {
    hover(props, monitor, component) {
        const { lastElementId, hoverElement } = props;

        var hoverBoundingRect = ReactDOM.findDOMNode(component).getBoundingClientRect();
        var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        var clientOffset = monitor.getClientOffset();
        var hoverClientY = clientOffset.y - hoverBoundingRect.top;

        let hoveredElement;
        if (hoverClientY < hoverMiddleY) {
            // Top
            hoveredElement = {
                id: lastElementId,
                top: false,
                middle: false,
                bottom: true,
            };
        } else {
            // Bottom
            hoveredElement = {
                id: 0,
                top: false,
                middle: false,
                bottom: false,
            };
        }

        const prevHoveredElement = _pick(props.hoveredElement, ['id', 'top', 'middle', 'bottom']);
        if (!_isEqual(prevHoveredElement, hoveredElement)) {
            hoverElement(hoveredElement);
        }
    },
};

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
    };
}

class Element extends React.Component {
    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        dragDropType: PropTypes.string,
        lastElementId: PropTypes.number,
        hoverElement: PropTypes.func,
        hoveredElement: PropTypes.object,
    };

    render() {
        const { connectDropTarget } = this.props;

        return connectDropTarget(<div className={style.lastElement} />);
    }
}

export default DropTarget(props => props.dragDropType, target, collectTarget)(Element);
