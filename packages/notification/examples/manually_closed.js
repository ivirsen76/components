import React from 'react'
import notification from '@ieremeev/notification'

const onClick = () => {
    notification({
        duration: 0,
        message: "I'll be here forever",
    })
}

/** Notification will be shown until you manually close it */
export default () => (
    <button className="ui button" onClick={onClick}>
        Click me
    </button>
)
