import React from 'react'
import PropTypes from 'prop-types'
import Loader from '@ieremeev/loader'

export default class Bundle extends React.Component {
    static propTypes = {
        load: PropTypes.func,
        onLoad: PropTypes.func,
    }

    state = {
        mod: null,
        loading: true,
    }

    componentWillMount() {
        this.load(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }

    load(props) {
        this.setState({
            mod: null,
            loading: true,
        })

        props.load(mod => {
            this.setState({
                mod: mod.default || mod,
                loading: false,
            })
        })
    }

    render() {
        return (
            <Loader loading={this.state.loading} removeChildren>
                {this.state.mod ? this.props.onLoad(this.state.mod) : null}
            </Loader>
        )
    }
}
