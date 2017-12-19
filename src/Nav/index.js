import React from 'react'
import PropTypes from 'prop-types'
import MenuLink from './MenuLink'
import componentData from '../../config/componentData.js'

export default class Component extends React.Component {
    static propTypes = {
        location: PropTypes.object,
    }

    render() {
        return (
            <div>
                <div className="ui vertical pointing menu" style={{ width: '100%' }}>
                    <MenuLink to="/sandbox">Sandbox</MenuLink>
                </div>
                <div className="ui vertical pointing menu" style={{ width: '100%' }}>
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
