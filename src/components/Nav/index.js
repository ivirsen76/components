import React from 'react'
import PropTypes from 'prop-types'
import MenuLink from './MenuLink'
import componentData from '../../../config/componentData.js'
import { connect } from 'react-redux'
import { setSearch } from '../../reducer'
import style from './style.module.css'

class Component extends React.Component {
    static propTypes = {
        search: PropTypes.string,
        setSearch: PropTypes.func,
    }

    setSearch = e => {
        e && e.preventDefault()
        this.props.setSearch(e.target.value)
    }

    getComponents = () => {
        const search = this.props.search.toLowerCase()

        if (search) {
            return componentData.filter(o => o.displayName.toLowerCase().includes(search))
        }

        return componentData
    }

    render() {
        return (
            <div>
                <div className="ui pointing vertical menu" style={{ width: '100%' }}>
                    <MenuLink to="/sandbox">Sandbox</MenuLink>
                </div>
                <div className="ui pointing vertical menu" style={{ width: '100%' }}>
                    <div className="item">
                        <h3>Components</h3>
                        <div className="ui icon input">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={this.props.search}
                                onChange={this.setSearch}
                                className={`${this.props.search && style.withData}`}
                            />
                            <i className="search icon" />
                        </div>
                    </div>
                    {this.getComponents().map(item => (
                        <MenuLink key={item.name} to={`/components/${item.name}`}>
                            {item.displayName}
                        </MenuLink>
                    ))}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    search: state.search,
})

export default connect(mapStateToProps, { setSearch })(Component)
