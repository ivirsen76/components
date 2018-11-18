import React from 'react'
import PropTypes from 'prop-types'
import style from './style.module.css'

/** Button with disabled and loading state */
export default class Button extends React.Component {
    static propTypes = {
        /** Title */
        title: PropTypes.node,

        /** Class name */
        className: PropTypes.string,

        /** Function to be called after clicking the button */
        onClick: PropTypes.func,

        /** Show loading state or not? */
        isLoading: PropTypes.bool,

        /** Show disabled state or not? */
        isDisabled: PropTypes.bool,

        /** Some button extra props */
        buttonProps: PropTypes.object,
    }

    static defaultProps = {
        title: 'Submit',
        className: 'ui compact button',
        onClick() {},
        isLoading: false,
        isDisabled: false,
    }

    clicked = e => {
        e.preventDefault()
        this.props.onClick()
    }

    render() {
        let { className, title, isDisabled, isLoading } = this.props

        if (isLoading) {
            isDisabled = true
        }

        return (
            <button
                type="button"
                {...this.props.buttonProps}
                className={className}
                style={{ position: 'relative' }}
                disabled={isDisabled}
                onClick={this.clicked}
            >
                {isLoading && <div className={'ui mini active inline loader ' + style.loader} />}
                {title}
            </button>
        )
    }
}
