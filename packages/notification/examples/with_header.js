import React from 'react'
import notification from '@ieremeev/notification'

const onClick = () => {
    notification({
        header: 'Success',
        message: 'The item has been added',
    })
}

export default () => (
    <button type="button" className="ui button" onClick={onClick}>
        Click me
    </button>
)
