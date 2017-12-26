import React from 'react'
import PropTypes from 'prop-types'
import MenuLink from './MenuLink'
import _sortBy from 'lodash/sortBy'
import componentData from '../../../config/componentData.js'

export default class Component extends React.Component {
    static propTypes = {
        search: PropTypes.string,
        setSearch: PropTypes.func,
    }

    getReactComponents = () => _sortBy(componentData.filter(o => o.isReact), ['packageName'])

    getOtherComponents = () => _sortBy(componentData.filter(o => !o.isReact), ['packageName'])

    render() {
        const reactComponents = this.getReactComponents()
        const otherComponents = this.getOtherComponents()

        return (
            <div>
                <div className="ui huge vertical menu" style={{ width: '100%' }}>
                    <MenuLink to="/about">About</MenuLink>
                    {process.env.NODE_ENV !== 'production' && (
                        <MenuLink to="/sandbox">Sandbox</MenuLink>
                    )}
                    {reactComponents.length > 0 && (
                        <div className="item">
                            <div className="header">React components</div>
                            <div className="menu">
                                {reactComponents.map(item => (
                                    <MenuLink key={item.name} to={`/components/${item.name}`}>
                                        {item.packageName}
                                    </MenuLink>
                                ))}
                            </div>
                        </div>
                    )}
                    {otherComponents.length > 0 && (
                        <div className="item">
                            <div className="header">Other components</div>
                            <div className="menu">
                                {otherComponents.map(item => (
                                    <MenuLink key={item.name} to={`/components/${item.name}`}>
                                        {item.packageName}
                                    </MenuLink>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
