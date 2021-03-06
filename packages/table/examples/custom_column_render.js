import React from 'react'
import Table from '@ieremeev/table'

/** You can render any react component in a cell */
export default () => {
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
