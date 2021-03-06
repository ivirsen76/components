import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom'
import storage from 'store'
import _pick from 'lodash/pick'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Component from './components/Component'
import NotFound from './components/NotFound'
import EnhancedRoute from './components/Route'
import Nav from './components/Nav'
import Sandbox from './Sandbox' // eslint-disable-line import/no-unresolved
import About from './components/About' // eslint-disable-line import/no-unresolved
import style from './style.module.css'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            search: '',
            collapsed: [],
            showMenu: false,
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
        this.setState(state => {
            let collapsed = [...state.collapsed]
            if (collapsed.includes(value)) {
                collapsed = collapsed.filter(o => o !== value)
            } else {
                collapsed.push(value)
            }

            return { collapsed }
        })
    }

    showMenu = e => {
        e && e.preventDefault()
        this.setState({ showMenu: true })
    }

    hideMenu = () => {
        this.setState({ showMenu: false })
    }

    render() {
        return (
            <BrowserRouter>
                <div className={style.site}>
                    <div className="ui inverted menu">
                        <a className={`icon item ${style.menuIcon}`} onClick={this.showMenu}>
                            <i className="content icon" />
                        </a>
                        <Link className="item" to="/">
                            Igor Eremeev demo
                        </Link>
                    </div>
                    {this.state.showMenu && <div className={style.hover} onClick={this.hideMenu} />}
                    <div
                        className={`${style.mobileMenu} ${this.state.showMenu && style.show}`}
                        onClick={this.hideMenu}
                    >
                        <Nav search={this.state.search} setSearch={this.setSearch} />
                    </div>
                    <div className={style.layout}>
                        <div className={style.sidebar}>
                            <Nav search={this.state.search} setSearch={this.setSearch} />
                        </div>
                        <div className={style.body}>
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

const DndApp = DragDropContext(HTML5Backend)(App)

ReactDOM.render(<DndApp />, document.getElementById('app'))
