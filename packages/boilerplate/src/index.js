import { init } from '@sentry/browser'
import _set from 'lodash/set'

if (process.env.IE_SENTRY_DSN) {
    init({
        dsn: process.env.IE_SENTRY_DSN,
    })
    _set(window, 'ieremeev.sentry', true)
}

export { default as App } from './components/App'
export { default as Route } from './components/Route'
export { default as NotFound } from './components/NotFound'
export { default as createStore } from './createStore.js'
export { default as history } from './history.js'
