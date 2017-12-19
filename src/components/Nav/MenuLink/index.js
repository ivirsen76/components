import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'

class MenuLink extends React.Component {
    static propTypes = {
        location: PropTypes.object,
        to: PropTypes.string,
        children: PropTypes.node,
    }

    render() {
        const { location, to } = this.props
        const isActive = location.pathname.includes(to)

        return (
            <Link className={`item ${isActive && 'active'}`} to={to}>
                {this.props.children}
            </Link>
        )
    }
}

export default withRouter(MenuLink)
