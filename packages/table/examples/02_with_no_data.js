import React from 'react'
import Table from '../src/index.js'

/** With no data */
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
