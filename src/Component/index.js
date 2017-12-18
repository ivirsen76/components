import React from 'react'
import PropTypes from 'prop-types'
import Example from '../Example'
import Table from '@ieremeev/table'
import _map from 'lodash/map'
import style from './style.module.css'

export default class Component extends React.Component {
    static propTypes = {
        data: PropTypes.object,
    }

    render() {
        const { description, packageName, displayName, props, examples } = this.props.data

        const columns = [
            { name: 'name', label: 'Name' },
            { name: 'description', label: 'Description' },
            { name: 'type', label: 'Type' },
            { name: 'default', label: 'Default' },
        ]

        const data = _map(props, (values, prop) => ({
            id: prop,
            name: prop,
            description: (
                <div
                    className={style.desc}
                    dangerouslySetInnerHTML={{ __html: values.description }}
                />
            ),
            type: values.type.name,
            isRequired: values.isRequired,
            default: values.defaultValue && values.defaultValue.value,
        }))

        return (
            <div>
                <h1>{displayName}</h1>
                <div>{description}</div>

                <h2>Installation</h2>
                <div className={style.code}>{`npm install ${packageName}`}</div>

                <h2>Props</h2>
                <Table className="ui compact celled table" columns={columns} data={data} />

                {examples.length > 0 && (
                    <div>
                        <div />
                        <h2>Examples</h2>
                        <div>
                            {examples.map(example => (
                                <div key={example.filePath} className={style.example}>
                                    <Example key={example.filePath} example={example} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}
