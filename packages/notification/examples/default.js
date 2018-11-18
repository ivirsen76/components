import React from 'react'
import notification from '@ieremeev/notification'

const onClick = () => {
    notification('Success')
}

export default () => (
    <button type="button" className="ui button" onClick={onClick}>
        Click me
    </button>
)
