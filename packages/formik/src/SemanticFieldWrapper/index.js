import React from 'react'
import PropTypes from 'prop-types'

export default class FormikFieldWrapper extends React.Component {
    static propTypes = {
        field: PropTypes.object,
        form: PropTypes.object,
        showErrorImmediately: PropTypes.bool,
        children: PropTypes.node,
    }

    render() {
        const { field, form, showErrorImmediately } = this.props
        const error = form.errors[field.name]
        const showError = !!(error && (form.submitCount > 0 || showErrorImmediately))

        return (
            <div className={'field ' + (showError && 'error')}>
                {this.props.children}
                {showError && <div className="ui pointing red basic label">{error}</div>}
            </div>
        )
    }
}
