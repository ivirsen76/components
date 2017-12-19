import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class Component extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={App} />
                    <Route path="/components/:component?" component={App} />
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Component />, document.getElementById('app'))
