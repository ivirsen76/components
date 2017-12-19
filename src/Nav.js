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
            <div className="ui vertical pointing menu" style={{ width: '100%' }}>
                {packages.map(item => (
                    <Link
                        key={item.name}
                        className={`item ${item.name === currentPackage && 'active'}`}
                        to={`/components/${item.name}`}
                    >
                        {item.displayName}
                    </Link>
                ))}
            </div>
        )
    }
}
