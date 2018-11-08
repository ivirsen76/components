import React from 'react'
import IconBase from '../src/IconBase.js'
import icons from '../src/bin/icons.json'
import style from './style.module.css'

export default class List extends React.Component {
    state = {
        filter: null,
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
                <div style={{ marginBottom: '10px', display: 'flex' }}>
                    <input
                        className="form-control"
                        value={this.state.filter}
                        onChange={this.handleFilterChange}
                        style={{ maxWidth: '200px', marginRight: '1em' }}
                        placeholder="Search"
                    />
                </div>
                <div className={style.iconWrapper}>
                    {filteredList.map(icon => (
                        <div className={style.icon}>
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
