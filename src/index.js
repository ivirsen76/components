import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import NotFound from './NotFound'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class Component extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="ui container">
                    <div className="ui inverted menu">
                        <a className="item">Components @ieremeev</a>
                    </div>
                    <Switch>
                        <Route exact path="/" component={App} />
                        <Route path="/components/:component?" component={App} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Component />, document.getElementById('app'))
