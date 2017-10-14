import React from 'react'
import { parse } from 'react-docgen'
import TableSource from '!raw-loader!../packages/table'
import Component from './Component'

export default class App extends React.Component {
    render() {
        return (
            <div className="ui container">
                <Component data={parse(TableSource)} />
            </div>
        )
    }
}
