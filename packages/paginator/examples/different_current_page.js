import React from 'react'
import Paginator from '../src'

export default class Component extends React.Component {
    render() {
        return <Paginator total={50} currentPage={5} />
    }
}
