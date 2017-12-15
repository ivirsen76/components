import React from 'react'
import PropTypes from 'prop-types'
import Arrow from '../Arrow'
import style from './style.module.scss'

const Sortable = ({ order }) => {
    if (order === 'asc') {
        return (
            <div className={style.sortableAsc}>
                <Arrow />
            </div>
        )
    } else if (order === 'desc') {
        return (
            <div className={style.sortableDesc}>
                <Arrow />
            </div>
        )
    }

    return (
        <div className={style.sortable}>
            <Arrow />
            <Arrow />
        </div>
    )
}

Sortable.propTypes = {
    order: PropTypes.string,
}

export default Sortable
