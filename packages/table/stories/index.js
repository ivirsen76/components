import React from 'react'
import Table from '../src/Table'
import { storiesOf } from '@kadira/storybook' // eslint-disable-line
import style from './style.module.scss'

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

const stories = storiesOf('table', module)

stories.add('simple', () => <Table columns={columns} data={data} />)

stories.add('with no data', () => <Table columns={columns} data={[]} noDataMessage="No data" />)

stories.add('custom table class', () =>
    <Table className="ui striped celled table" columns={columns} data={data} />
)

stories.add('custom column render', () => {
    const adjustedColumns = [
        { name: 'id', label: 'ID' },
        {
            name: 'name',
            label: 'Name',
            render(value, row) {
                return (
                    <div className="ui label">
                        {value}
                    </div>
                )
            },
        },
        {
            name: 'email',
            label: 'Email',
            render(value, row) {
                return (
                    <a href={`email:${value}`}>
                        {value}
                    </a>
                )
            },
        },
    ]

    return <Table columns={adjustedColumns} data={data} />
})

stories.add('show row number', () => <Table columns={columns} data={data} showRowNumber />)

stories.add('with pagination', () =>
    <Table columns={columns} data={data} perPage={2} showRowNumber />
)

stories.add('hide bottom paginator', () =>
    <Table columns={columns} data={data} perPage={2} hideBottomPaginator />
)

stories.add('show filters', () => {
    const adjustedColumns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Name', filter: true },
        { name: 'email', label: 'Email', filter: true },
    ]

    return <Table columns={adjustedColumns} data={data} />
})

stories.add('show sorting', () => {
    const adjustedColumns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Name', sort: true },
        { name: 'email', label: 'Email', sort: true },
    ]

    return <Table columns={adjustedColumns} data={data} />
})

stories.add('with sort, filter, row number', () => {
    const adjustedColumns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Name', filter: true, sort: true },
        { name: 'email', label: 'Email', filter: true, sort: true },
    ]

    return <Table columns={adjustedColumns} data={data} showRowNumber />
})

stories.add('with custom class for column', () => {
    const adjustedColumns = [
        { name: 'id', label: 'ID' },
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'Email', className: style.nowrap },
    ]
    const newData = [
        {
            id: 44,
            name: 'Word '.repeat(40),
            email: "this one shouldn't be wrapped",
        },
    ]

    return <Table columns={adjustedColumns} data={newData} />
})
