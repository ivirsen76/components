import React from 'react'
import Responsive from '@ieremeev/responsive'
import style from './style.module.css'

/** Try to resize the window */
export default () => (
    <Responsive stylesheet={style} showWidth>
        {'Applied wrapper class "'}
        <span className={style.info} />
        {'"'}
    </Responsive>
)
