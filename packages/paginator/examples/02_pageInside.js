import React from 'react'
import Paginator from '../src'

/** Different current page */
export default class Component extends React.Component {
    render() {
        return <Paginator total={50} currentPage={3} />
    }
}
