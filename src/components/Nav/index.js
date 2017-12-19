import React from 'react'
import PropTypes from 'prop-types'
import MenuLink from './MenuLink'
import componentData from '../../../config/componentData.js'

export default class Component extends React.Component {
    static propTypes = {
        location: PropTypes.object,
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
                            <input type="text" placeholder="Search..." />
                            <i className="search icon" />
                        </div>
                    </div>
                    {componentData.map(item => (
                        <MenuLink key={item.name} to={`/components/${item.name}`}>
                            {item.displayName}
                        </MenuLink>
                    ))}
                </div>
            </div>
        )
    }
}
