import React from 'react'

/* eslint-disable import/no-unresolved */
import { Link } from 'react-router-dom'

export default class Component extends React.Component {
    render() {
        return (
            <div>
                <h2>404 ERROR</h2>
                <div style={{ marginBottom: '1em' }}>
                    Sorry, an error has occured, Requested page not found!
                </div>
                <Link className="btn btn-primary" to="/">
                    Take Me Home
                </Link>
            </div>
        )
    }
}
