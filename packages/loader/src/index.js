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
        if (this.props.type === 'inline') {
            return (
                <div className="ui basic segment" style={{ padding: '0' }}>
                    {this.props.loading && (
                        <div className="ui active inverted dimmer">
                            <div className="ui active loader" />
                        </div>
                    )}
                    {!this.props.removeChildren && this.props.children}
                </div>
            )
        }

        return (
            <div>
                {this.props.loading && (
                    <div className={style.loader}>
                        <div className="ui active inverted dimmer">
                            <div className="ui text loader">{this.props.text}</div>
                        </div>
                    </div>
                )}
                {!this.props.removeChildren && this.props.children}
            </div>
        )
    }
}
