import React from 'react'
import notification from '@ieremeev/notification'

const onClick = () => {
    notification({
        type: 'negative',
        message: 'Some error message',
    })
}

export default () => (
    <button className="ui button" onClick={onClick}>
        Click me
    </button>
)
