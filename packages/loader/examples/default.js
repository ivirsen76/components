import React from 'react'
import Loader from '@ieremeev/loader'

/** Click the button and see the loader for 3 seconds */
export default class Component extends React.Component {
    state = {
        loading: false,
    }

    onClick = () => {
        this.setState({ loading: true })
        setTimeout(() => this.setState({ loading: false }), 3000)
    }

    render() {
        return (
            <Loader loading={this.state.loading}>
                <button type="button" className="ui button" onClick={this.onClick}>
                    Click me
                </button>
            </Loader>
        )
    }
}
