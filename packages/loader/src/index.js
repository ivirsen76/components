import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

/** Shows a loader spinner */
export default class Loader extends React.Component {
    static propTypes = {
        /** Show loading spinner or not? */
        loading: PropTypes.bool,

        /** Loading text below the spinner */
        text: PropTypes.string,

        /** Remove children from the background or not? */
        removeChildren: PropTypes.bool,

        /** @ignore */
        children: PropTypes.node,
    }

    static defaultProps = {
        loading: false,
        text: 'Loading',
        removeChildren: false,
    }

    render() {
        if (!this.props.loading) {
            return <div>{this.props.children}</div>
        }

        return (
            <div>
                <div className={style.loader}>
                    <div className="ui active inverted dimmer">
                        <div className="ui text loader">{this.props.text}</div>
                    </div>
                </div>
                {!this.props.removeChildren && this.props.children}
            </div>
        )
    }
}
