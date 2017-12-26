import React from 'react'
import Responsive from '@ieremeev/responsive'
import style from './color.module.css'

/** Try to resize the window */
export default () => (
    <Responsive
        stylesheet={style}
        widthBreakpoints={{
            xsmall: 400,
            small: 500,
            medium: 600,
            large: 700,
        }}
    >
        <div className={style.color} />
    </Responsive>
)
