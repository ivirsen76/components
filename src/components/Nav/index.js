import React from 'react'
import PropTypes from 'prop-types'
import MenuLink from './MenuLink'
import Search from './Search'
import componentData from '../../../config/componentData.js'

export default class Component extends React.Component {
    static propTypes = {
        search: PropTypes.string,
        setSearch: PropTypes.func,
    }

    getComponents = () => {
        const search = this.props.search.toLowerCase()

        if (search) {
            return componentData.filter(o => o.name.toLowerCase().includes(search))
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
                        <Search search={this.props.search} setSearch={this.props.setSearch} />
                    </div>
                    {this.getComponents().map(item => (
                        <MenuLink key={item.name} to={`/components/${item.name}`}>
                            {item.name}
                        </MenuLink>
                    ))}
                </div>
            </div>
        )
    }
}
