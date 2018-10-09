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

        /** Loader type: "global" or "inline" */
        type: PropTypes.string,

        /** @ignore */
        children: PropTypes.node,
    }

    static defaultProps = {
        loading: false,
        text: 'Loading',
        removeChildren: false,
        type: 'global',
    }

    render() {
        const removeChildren = this.props.loading && this.props.removeChildren

        if (this.props.type === 'inline') {
            return (
                <div className="ui basic segment" style={{ padding: '0' }}>
                    {this.props.loading && <div className="ui active loader" />}
                    {!removeChildren && this.props.children}
                </div>
            )
        }

        return (
            <div>
                {this.props.loading && (
                    <div className={style.loader}>
                        <div className="ui active text loader">{this.props.text}</div>
                    </div>
                )}
                {!removeChildren && this.props.children}
            </div>
        )
    }
}
