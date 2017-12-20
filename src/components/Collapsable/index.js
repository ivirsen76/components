import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

export default class Component extends React.Component {
    static propTypes = {
        title: PropTypes.node,
        children: PropTypes.node,
        value: PropTypes.string,
        collapsed: PropTypes.array,
        toggleCollapsed: PropTypes.func,
    }

    toggle = e => {
        e && e.preventDefault()
        this.props.toggleCollapsed(this.props.value)
    }

    render() {
        const collapsed = this.props.collapsed.includes(this.props.value)

        return (
            <div>
                <div onClick={this.toggle} className={style.link}>
                    <div />
                    <h2>
                        {this.props.title}
                        {collapsed ? (
                            <div className={style.arrowLeft} />
                        ) : (
                            <div className={style.arrowDown} />
                        )}
                    </h2>
                    <div />
                </div>
                {!collapsed && this.props.children}
            </div>
        )
    }
}
