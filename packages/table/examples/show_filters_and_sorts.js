import React from 'react'
import Table from '@ieremeev/table'

export default () => {
    const data = [
        { id: 11, name: 'Mike', email: 'mike@gmail.com', status: 1 },
        { id: 22, name: 'Helen', email: 'helen@gmail.com', status: 2 },
        { id: 33, name: 'Bob', email: 'bob@gmail.com', status: 2 },
    ]

    const columns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Name', filter: true, sort: true },
        { name: 'email', label: 'Email', filter: true, sort: true },
        {
            name: 'status',
            label: 'Status',
            filter: true,
            filterSettings: {
                type: 'selectbox',
                options: [{ label: 'New', value: 1 }, { label: 'Old', value: 2 }],
            },
            sort: true,
            render: (value, row) => (value === 1 ? 'New' : 'Old'),
        },
    ]

    return <Table columns={columns} data={data} />
}
