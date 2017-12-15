import React from 'react'
import Table from '../src/index.js'

/** Simple */
export default class Component extends React.Component {
    render() {
        const data = [
            { id: 11, name: 'Mike', email: 'mike@gmail.com' },
            { id: 22, name: 'Helen', email: 'helen@gmail.com' },
            { id: 33, name: 'Bob', email: 'bob@gmail.com' },
        ]

        const columns = [
            { name: 'id', label: 'ID' },
            { name: 'name', label: 'Name' },
            { name: 'email', label: 'Email' },
        ]

        return <Table columns={columns} data={data} />
    }
}
