import React from 'react'
import PropTypes from 'prop-types'

export default class FormikFieldWrapper extends React.Component {
    static propTypes = {
        field: PropTypes.object,
        form: PropTypes.object,
        children: PropTypes.node,
    }

    render() {
        const { field, form } = this.props
        const error = form.errors[field.name]
        const showError = !!(error && form.submitCount > 0)

        return (
            <div className={'field ' + (showError && 'error')}>
                {this.props.children}
                {showError && <div className="ui pointing red basic label">{error}</div>}
            </div>
        )
    }
}
