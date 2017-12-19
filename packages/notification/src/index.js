import React from 'react'
import ReactDOM from 'react-dom'
import Alert from './Alert'
import style from './style.module.scss'

/** Notification using Semantic UI */
export default async options => {
    if (typeof options === 'string') {
        options = {
            message: options,
        }
    }

    let wrapper = document.getElementById('znanium-notification-wrapper')
    if (!wrapper) {
        wrapper = document.body.appendChild(document.createElement('div'))
        wrapper.id = 'znanium-notification-wrapper'
        wrapper.className = style.wrapper
    }

    let target = wrapper.appendChild(document.createElement('div'))

    await new Promise((resolve, reject) => {
        ReactDOM.render(<Alert {...options} onClose={resolve} />, target)
    })

    ReactDOM.unmountComponentAtNode(target)
    setTimeout(() => {
        target.remove()
    })
}
