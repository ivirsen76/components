import React from 'react'
import Table from '@ieremeev/table'

/** Sort and filter settings will be saved in local storage. Reload browser and see the result. */
export default () => {
    const data = [
        { id: 11, name: 'Mike', email: 'mike@gmail.com' },
        { id: 22, name: 'Helen', email: 'helen@gmail.com' },
        { id: 33, name: 'Bob', email: 'bob@gmail.com' },
    ]

    const columns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Name', filter: true, sort: true },
        { name: 'email', label: 'Email', filter: true, sort: true },
    ]

    return <Table columns={columns} data={data} saveSettings />
}
