import React from 'react'
import ReactDOM from 'react-dom'
import Component from './components/Component'
import NotFound from './components/NotFound'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import EnhancedRoute from './components/Route'
import Nav from './components/Nav'
import Sandbox from './Sandbox' // eslint-disable-line import/no-unresolved
import About from './components/About' // eslint-disable-line import/no-unresolved
import storage from 'store'
import _pick from 'lodash/pick'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            collapsed: [],
            ..._pick(storage.get('@ieremeev'), ['search', 'collapsed']),
        }
    }

    componentDidUpdate() {
        storage.set('@ieremeev', this.state)
    }

    setSearch = value => {
        this.setState({ search: value })
    }

    toggleCollapsed = value => {
        let collapsed = [...this.state.collapsed]
        if (collapsed.includes(value)) {
            collapsed = collapsed.filter(o => o !== value)
        } else {
            collapsed.push(value)
        }

        this.setState({ collapsed })
    }

    render() {
        return (
            <BrowserRouter>
                <div className="ui container">
                    <div className="ui inverted menu">
                        <a className="item">Components @ieremeev</a>
                    </div>
                    <div className="ui grid">
                        <div className="four wide column">
                            <Nav search={this.state.search} setSearch={this.setSearch} />
                        </div>
                        <div className="twelve wide column">
                            <Switch>
                                <Route exact from="/" render={() => <Redirect to="/about" />} />
                                <Route path="/about" component={About} />
                                <EnhancedRoute
                                    path="/components/:component?"
                                    component={Component}
                                    componentProps={{
                                        collapsed: this.state.collapsed,
                                        toggleCollapsed: this.toggleCollapsed,
                                    }}
                                />
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
