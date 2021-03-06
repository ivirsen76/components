import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux' // eslint-disable-line import/no-unresolved
import history from '../../history.js'
import { captureGlobalClick } from '../../reducers/boilerplate.js'

export default class App extends React.Component {
    static propTypes = {
        store: PropTypes.object,
        children: PropTypes.node,
    }

    onGlobalClick = () => {
        const { store } = this.props
        if (!store.getState().boilerplate.globalClickCaptured) {
            store.dispatch(captureGlobalClick())
        }
    }

    render() {
        return (
            <div onClick={this.onGlobalClick} style={{ minHeight: '100vh' }}>
                <Provider store={this.props.store}>
                    <ConnectedRouter history={history}>{this.props.children}</ConnectedRouter>
                </Provider>
            </div>
        )
    }
}
