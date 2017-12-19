import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import NotFound from './NotFound'
import Sandbox from './Sandbox'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Nav from './Nav'

class Component extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <div className="ui container">
                    <div className="ui inverted menu">
                        <a className="item">Components @ieremeev</a>
                    </div>
                    <div className="ui grid">
                        <div className="three wide column">
                            <Nav />
                        </div>
                        <div className="thirteen wide column">
                            <Switch>
                                <Route exact path="/" component={App} />
                                <Route path="/components/:component?" component={App} />
                                <Route path="/sandbox" component={Sandbox} />
                                <Route component={NotFound} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Component />, document.getElementById('app'))
