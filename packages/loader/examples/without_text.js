import React from 'react'
import Loader from '@ieremeev/loader'

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
            <Loader loading={this.state.loading} text={null}>
                <button type="button" className="ui button" onClick={this.onClick}>
                    Click me
                </button>
            </Loader>
        )
    }
}
