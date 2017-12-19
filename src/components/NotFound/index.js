import React from 'react'
import { Link } from 'react-router-dom'

export default class Component extends React.Component {
    render() {
        return (
            <div className="ui container">
                <h2>404 ERROR</h2>
                <div style={{ marginBottom: '1em' }}>
                    Sorry, an error has occured, Requested page not found!
                </div>
                <Link className="ui button" to="/">
                    Take Me Home
                </Link>
            </div>
        )
    }
}
