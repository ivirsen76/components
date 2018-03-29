import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'react-router-redux'
import history from '../../history.js'

/* eslint-disable import/no-unresolved */
import { Provider } from 'react-redux'

export default class App extends React.Component {
    static propTypes = {
        store: PropTypes.object,
        children: PropTypes.node,
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <ConnectedRouter history={history}>{this.props.children}</ConnectedRouter>
            </Provider>
        )
    }
}
