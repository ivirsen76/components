import React from 'react'
import PropTypes from 'prop-types'
import _omit from 'lodash/omit'
import { Route } from 'react-router-dom'

export default class EnhancedRoute extends React.Component {
    static propTypes = {
        component: PropTypes.func.isRequired,
        componentProps: PropTypes.object,
    }

    static defaultProps = {
        componentProps: {},
    }

    EnhancedComponent = props => {
        const Component = this.props.component
        return <Component {...props} {...this.props.componentProps} />
    }

    render() {
        const props = _omit(this.props, ['component', 'componentProps'])

        return <Route {...props} component={this.EnhancedComponent} />
    }
}
