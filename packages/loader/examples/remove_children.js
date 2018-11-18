import React from 'react'
import Loader from '@ieremeev/loader'

/** Removes button when loading */
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
            <Loader loading={this.state.loading} removeChildren>
                <button type="button" className="ui button" onClick={this.onClick}>
                    Click me
                </button>
            </Loader>
        )
    }
}
