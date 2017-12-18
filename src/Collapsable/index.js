import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

export default class Component extends React.Component {
    static propTypes = {
        title: PropTypes.node,
        children: PropTypes.node,
    }

    state = {
        expanded: true,
    }

    toggle = e => {
        e && e.preventDefault()
        this.setState(state => ({ expanded: !state.expanded }))
    }

    render() {
        return (
            <div>
                <div onClick={this.toggle} className={style.link}>
                    <div />
                    <h2>
                        {this.props.title}
                        {this.state.expanded ? (
                            <div className={style.arrowDown} />
                        ) : (
                            <div className={style.arrowLeft} />
                        )}
                    </h2>
                    <div />
                </div>
                {this.state.expanded && this.props.children}
            </div>
        )
    }
}
