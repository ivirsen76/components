import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class Component extends React.Component {
    static propTypes = {
        packages: PropTypes.array,
    }

    render() {
        return (
            <div>
                {this.props.packages.map(item => (
                    <div key={item.name}>
                        <Link to={`/${item.name}`}>{item.displayName}</Link>
                    </div>
                ))}
            </div>
        )
    }
}
