import store from 'store'
import _omit from 'lodash/omit'

export const storageKey = 'ieremeev_app'

export default {
    get: key => {
        const result = store.get(storageKey) || {}
        return key ? result[key] : result
    },
    set: (key, value) => {
        store.set(storageKey, {
            ...store.get(storageKey),
            [key]: value,
        })
    },
    remove: key => {
        store.set(storageKey, _omit(store.get(storageKey) || {}, [key]))
    },
}
