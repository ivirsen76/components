import React from 'react'
import PropTypes from 'prop-types'
import Example from '../Example'
import Table from '@ieremeev/table'
import _map from 'lodash/map'
import Collapsable from '../Collapsable'
import style from './style.module.css'

export default class Component extends React.Component {
    static propTypes = {
        data: PropTypes.object,
    }

    render() {
        const { description, packageName, displayName, version, props, examples } = this.props.data

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
                <h1>
                    {displayName}
                    <div className={`ui small teal label ${style.version}`}>{version}</div>
                </h1>
                <div>{description}</div>

                <Collapsable title="Installation">
                    <div className={style.code}>{`npm install ${packageName}`}</div>
                </Collapsable>

                <Collapsable title="Props">
                    <Table className="ui compact celled table" columns={columns} data={data} />
                </Collapsable>

                {examples.length > 0 && (
                    <Collapsable title="Examples">
                        {examples.map(example => (
                            <div key={example.filePath} className={style.example}>
                                <Example key={example.filePath} example={example} />
                            </div>
                        ))}
                    </Collapsable>
                )}
            </div>
        )
    }
}
