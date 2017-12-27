import React from 'react'
import PropTypes from 'prop-types'
import Table from '@ieremeev/table'
import _map from 'lodash/map'
import sizeMe from 'react-sizeme'
import style from './style.module.css'

class Component extends React.Component {
    static propTypes = {
        props: PropTypes.object,
        size: PropTypes.object,
    }

    renderAsTable = () => {
        const { props } = this.props

        const columns = [
            { name: 'name', label: 'Name', filter: true },
            { name: 'description', label: 'Description', filter: true },
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
            default: values.defaultValue && values.defaultValue.value,
        }))

        return <Table columns={columns} data={data} />
    }

    renderAsList = () => {
        const { props } = this.props

        const list = _map(props, (values, prop) => (
            <div key={prop} className={style.prop}>
                <div className="ui segment">
                    <h3>{prop}</h3>
                    <div
                        className={style.desc}
                        dangerouslySetInnerHTML={{ __html: values.description }}
                    />

                    <div>
                        <em>Type:</em>
                        {values.type.name}
                    </div>
                    <div>
                        <em>Default:</em>
                        {(values.defaultValue && values.defaultValue.value) || null}
                    </div>
                </div>
            </div>
        ))

        return list
    }

    render() {
        const width = this.props.size.width

        return <div>{width > 600 ? this.renderAsTable() : this.renderAsList()}</div>
    }
}

export default sizeMe({
    refreshRate: 100, // we don't need to refresh page so often (default 16)
})(Component)
