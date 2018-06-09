/* eslint-disable func-names */
import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import _mapValues from 'lodash/mapValues'
import _isEmpty from 'lodash/isEmpty'
import _pick from 'lodash/pick'
import history from './history.js'
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import storage from 'store'
import { storageKey } from './storage.js'

const storageObject = storage.get(storageKey) || {}

// Enchance reducer to add persist functionality
const persistReducer = (reducer, { code, keys }) => {
    const initialState = reducer(undefined, { type: 'some.undefined.action' })
    const persistedState = {
        ...initialState,
        ..._pick(storageObject.redux && storageObject.redux[code], keys),
    }

    return (state = persistedState, action) => {
        const resultedState = reducer(state, action)
        if (resultedState !== state) {
            storageObject.redux = storageObject.redux || {}
            storageObject.redux[code] = _pick(resultedState, keys)
            storage.set(storageKey, storageObject)
        }

        return resultedState
    }
}

// Create store in global area
;(() => {
    function createReducer(asyncReducers, preloadedState) {
        const reducer = combineReducers({
            form: formReducer,
            router: routerReducer,
            ...asyncReducers,
        })

        return (state = preloadedState, action) => reducer(state, action)
    }

    const initialState = {}
    const reducer = createReducer()
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
              shouldHotReload: false,
          })
        : compose
    const middlewares = [thunk, routerMiddleware(history)]
    const store = createStore(
        reducer,
        initialState,
        composeEnhancers(applyMiddleware(...middlewares))
    )

    store.asyncReducers = {}
    store.injectReducer = function(name, asyncReducer) {
        // Don't inject the same reducer twice
        if (this.asyncReducers[name]) {
            console.error(`Trying to mount reducer at the "${name}" key twice`)
            return
        }

        this.asyncReducers[name] = asyncReducer
        this.replaceReducer(createReducer(this.asyncReducers, this.getState()))
    }

    // add store to global
    window.ieremeev = window.ieremeev || {}
    window.ieremeev.store = store
})()

export default reducers => {
    const store = window.ieremeev.store

    if (_isEmpty(reducers)) {
        return store
    }

    const reducer = combineReducers({
        ..._mapValues(reducers, (o, code) => {
            if (o.persist) {
                return persistReducer(o.reducer, {
                    code: `app.${code}`,
                    keys: o.persist.keys || [],
                })
            }

            return o.reducer
        }),
    })

    store.injectReducer('app', reducer)

    return store
}
