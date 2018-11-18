import React from 'react'
import PropTypes from 'prop-types'
import _omit from 'lodash/omit'
import { Route } from 'react-router-dom' // eslint-disable import/no-unresolved
import Bundle from '../Bundle'

export default class App extends React.Component {
    static propTypes = {
        component: PropTypes.func.isRequired,
        componentProps: PropTypes.object,
        layout: PropTypes.func,
    }

    static defaultProps = {
        componentProps: {},
    }

    isReactComponent = component => {
        if (component.prototype.render || String(component).includes('.createElement(')) {
            return true
        }

        return false
    }

    EnhancedComponent = props => {
        const Layout = this.props.layout
        const Component = this.props.component

        let result
        if (this.isReactComponent(Component)) {
            // if real react component
            result = <Component {...props} {...this.props.componentProps} />
        } else {
            // if lazy loaded react module
            result = (
                <Bundle
                    load={Component}
                    onLoad={Mod => <Mod {...props} {...this.props.componentProps} />}
                />
            )
        }

        return Layout ? <Layout>{result}</Layout> : result
    }

    render() {
        const props = _omit(this.props, ['component', 'componentProps', 'layout'])

        return <Route {...props} component={this.EnhancedComponent} />
    }
}
