import React from 'react'
import PropTypes from 'prop-types'
import Example from '../Example'
import Table from '@ieremeev/table'
import _map from 'lodash/map'
import Collapsable from '../Collapsable'
import componentData from '../../../config/componentData.js'
import NotFound from '../NotFound'
import style from './style.module.css'

export default class Component extends React.Component {
    static propTypes = {
        match: PropTypes.object,
        collapsed: PropTypes.array,
        toggleCollapsed: PropTypes.func,
    }

    render() {
        const componentName = this.props.match.params.component
        const info = componentData.find(item => item.name === componentName)
        if (!info) {
            return <NotFound />
        }
        const { description, packageName, version, props, examples } = info

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
                    {packageName}
                    <div className={`ui small teal label ${style.version}`}>{version}</div>
                </h1>
                <div>{description}</div>

                <Collapsable
                    title="Installation"
                    value="installation"
                    collapsed={this.props.collapsed}
                    toggleCollapsed={this.props.toggleCollapsed}
                >
                    <div className={style.code}>{`npm install ${packageName}`}</div>
                </Collapsable>

                {Object.keys(props).length > 0 && (
                    <Collapsable
                        title="Props"
                        value="props"
                        collapsed={this.props.collapsed}
                        toggleCollapsed={this.props.toggleCollapsed}
                    >
                        <Table
                            className="ui unstackable compact celled table"
                            columns={columns}
                            data={data}
                        />
                    </Collapsable>
                )}

                {examples.length > 0 && (
                    <Collapsable
                        title="Examples"
                        value="examples"
                        collapsed={this.props.collapsed}
                        toggleCollapsed={this.props.toggleCollapsed}
                    >
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
