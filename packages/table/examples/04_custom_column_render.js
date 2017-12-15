import React from 'react'
import Table from '@ieremeev/table'

/** Custom column renders */
export default class Component extends React.Component {
    render() {
        const data = [
            { id: 11, name: 'Mike', email: 'mike@gmail.com' },
            { id: 22, name: 'Helen', email: 'helen@gmail.com' },
            { id: 33, name: 'Bob', email: 'bob@gmail.com' },
        ]

        const columns = [
            { name: 'id', label: 'ID' },
            {
                name: 'name',
                label: 'Name',
                render(value, row) {
                    return <div className="ui label">{value}</div>
                },
            },
            {
                name: 'email',
                label: 'Email',
                render(value, row) {
                    return <a href={`email:${value}`}>{value}</a>
                },
            },
        ]

        return <Table columns={columns} data={data} />
    }
}
