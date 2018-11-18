/* eslint-disable react/no-array-index-key */
import React from 'react'
import icons from '../bin/icons.json'
import style from './style.module.css'

const IconBase = require('@ieremeev/icons')

export default class List extends React.Component {
    state = {
        filter: '',
    }

    getFilteredList = () => {
        if (!this.state.filter) {
            return icons
        }

        return icons.filter(icon => icon.tags.join(',').includes(this.state.filter))
    }

    handleFilterChange = e => {
        this.setState({ filter: e.target.value })
    }

    render() {
        const filteredList = this.getFilteredList()

        return (
            <div>
                <div className="ui form" style={{ marginBottom: '10px', display: 'flex' }}>
                    <div className="field">
                        <input
                            value={this.state.filter}
                            onChange={this.handleFilterChange}
                            style={{ maxWidth: '200px', marginRight: '1em' }}
                            placeholder="Search"
                        />
                    </div>
                </div>
                <div className={style.iconWrapper}>
                    {filteredList.map(icon => (
                        <div key={icon.name} className={style.icon}>
                            <div className={style.name}>
                                <span>{icon.name}</span>
                            </div>
                            <IconBase viewBox={icon.viewBox}>
                                <g>
                                    {icon.paths.map((path, index) => <path key={index} d={path} />)}
                                </g>
                            </IconBase>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
