import React from 'react'
import IconBase from '@ieremeev/icons'
import Tooltip from '@ieremeev/tooltip' // eslint-disable-line
import icons from '../bin/icons.json'
import style from './style.module.css'

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
                        <Tooltip key={icon.name} title={icon.name}>
                            <div className={style.icon}>
                                <IconBase viewBox={icon.viewBox}>
                                    <g>
                                        {icon.paths.map((path, index) => (
                                            <path key={index} d={path} />
                                        ))}
                                    </g>
                                </IconBase>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </div>
        )
    }
}
