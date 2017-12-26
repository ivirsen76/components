import React from 'react'
import Responsive from '@ieremeev/responsive'
import style from './style.module.css'

/**
 * Try to resize the window.
 * New breakpoints: xsmall: 400, small: 500, medium: 600, large: 700
 */
export default () => (
    <Responsive
        stylesheet={style}
        showWidth
        widthBreakpoints={{
            xsmall: 400,
            small: 500,
            medium: 600,
            large: 700,
        }}
    >
        {'Applied wrapper class "'}
        <span className={style.info} />
        {'"'}
    </Responsive>
)
