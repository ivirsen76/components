import React from 'react'
import PropTypes from 'prop-types'
import Table from '@ieremeev/table'
import _map from 'lodash/map'

export default class Component extends React.Component {
    static propTypes = {
        data: PropTypes.object,
    }

    render() {
        const { description, displayName, props } = this.props.data
        console.log(props)

        const columns = [
            { name: 'name', label: 'Name' },
            { name: 'description', label: 'Description' },
            { name: 'type', label: 'Type' },
            { name: 'isRequired', label: 'Required?' },
            { name: 'default', label: 'Default' },
        ]

        const data = _map(props, (values, prop) => ({
            id: prop,
            name: prop,
            description: values.description,
            type: values.type.name,
            isRequired: values.isRequired,
            default: values.defaultValue.value,
        }))

        return (
            <div>
                <h1>{displayName}</h1>
                <div>{description}</div>
                <div>Props</div>
                <Table columns={columns} data={data} />
            </div>
        )
    }
}
