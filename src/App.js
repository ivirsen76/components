import React from 'react'
import PropTypes from 'prop-types'
import Component from './Component'
import Nav from './Nav.js'
import componentData from '../config/componentData.js'

export default class App extends React.Component {
    static propTypes = {
        match: PropTypes.object,
        history: PropTypes.object,
    }

    componentDidMount() {
        if (!this.props.match.params.component) {
            this.props.history.push(`/components/${componentData[0].name}`)
        }
    }

    render() {
        const { params } = this.props.match
        const currentComponentData = componentData.find(item => item.name === params.component)

        return (
            <div className="ui grid">
                <div className="three wide column">
                    <Nav
                        packages={componentData}
                        currentPackage={this.props.match.params.component}
                    />
                </div>
                {currentComponentData && (
                    <div className="thirteen wide column">
                        <Component data={currentComponentData} />
                    </div>
                )}
            </div>
        )
    }
}
