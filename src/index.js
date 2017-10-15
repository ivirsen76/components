import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { BrowserRouter, Route } from 'react-router-dom'

class Component extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route path="/:component?" component={App} />
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Component />, document.getElementById('app'))
