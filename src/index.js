import React from 'react'
import ReactDOM from 'react-dom'
import Component from './components/Component'
import NotFound from './components/NotFound'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Nav from './components/Nav'
import Sandbox from './Sandbox' // eslint-disable-line import/no-unresolved
import componentData from '../config/componentData.js'

class App extends React.Component {
    state = {
        search: '',
    }

    setSearch = value => {
        this.setState({ search: value })
    }

    render() {
        return (
            <BrowserRouter>
                <div className="ui container">
                    <div className="ui inverted menu">
                        <a className="item">Components @ieremeev</a>
                    </div>
                    <div className="ui grid">
                        <div className="three wide column">
                            <Nav search={this.state.search} setSearch={this.setSearch} />
                        </div>
                        <div className="thirteen wide column">
                            <Switch>
                                <Route
                                    exact
                                    from="/"
                                    render={() => (
                                        <Redirect to={`/components/${componentData[0].name}`} />
                                    )}
                                />
                                <Route path="/components/:component?" component={Component} />
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

ReactDOM.render(<App />, document.getElementById('app'))
