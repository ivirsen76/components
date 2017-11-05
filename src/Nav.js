import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class Component extends React.Component {
    static propTypes = {
        packages: PropTypes.array,
        currentPackage: PropTypes.string,
    }

    render() {
        const { packages, currentPackage } = this.props

        return (
            <div className="ui vertical menu" style={{ width: '100%' }}>
                <div className="item">
                    <div className="header">Components</div>
                    <div className="menu">
                        {packages.map(item => (
                            <Link
                                key={item.name}
                                className={`item ${item.name === currentPackage && 'active'}`}
                                to={`/${item.name}`}
                            >
                                {item.displayName}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}
