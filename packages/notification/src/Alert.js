import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.scss'

export default class Alert extends React.Component {
    transitionTime = 600
    timeouts = []

    static propTypes = {
        header: PropTypes.node,
        message: PropTypes.node,
        type: PropTypes.string,
        duration: PropTypes.number,
        onClose: PropTypes.func,
    }

    static defaultProps = {
        header: null,
        message: 'Are you sure?',
        type: 'positive',
        duration: 5000,
        onClose() {},
    }

    state = {
        loaded: false,
    }

    componentDidMount = () => {
        const { duration } = this.props

        if (duration > 0) {
            this.timeouts.push(
                setTimeout(() => {
                    this.setState({ loaded: false })
                }, duration)
            )

            this.timeouts.push(setTimeout(this.close, duration + this.transitionTime))
        }

        this.timeouts.push(
            setTimeout(() => {
                this.setState({ loaded: true })
            }, 100)
        )
    }

    componentWillUnmount = () => {
        this.props.onClose()

        // clear all timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout))
    }

    close = () => {
        this.props.onClose()
    }

    render() {
        const { header, message, type } = this.props

        return (
            <div className={style.alert + ' ' + (this.state.loaded && style.loaded)}>
                <div className={`ui ${type} message`}>
                    <i className="close icon" onClick={this.close} />
                    {header && <div className="header">{header}</div>}
                    {header ? <p>{message}</p> : message}
                </div>
            </div>
        )
    }
}
