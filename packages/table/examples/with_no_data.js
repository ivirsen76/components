import React from 'react'
import Table from '@ieremeev/table'

export default class Component extends React.Component {
    render() {
        const data = []
        const columns = [
            { name: 'id', label: 'ID' },
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email' },
        ]

        return <Table columns={columns} data={data} noDataMessage="No data" />
    }
}
