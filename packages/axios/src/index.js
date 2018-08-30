import axios from 'axios'
import notification from '@ieremeev/notification'

let loginRedirect = () => {}

axios.interceptors.response.use(null, error => {
    if (error && error.response) {
        switch (error.response.status) {
            // Some validation error
            case 400: {
                const errors = (error.response.data && error.response.data.errors) || {}
                return Promise.reject(errors)
            }

            case 401:
                if (!/auth\/local$/.test(error.response.config.url)) {
                    loginRedirect()
                }
                break

            default:
                notification({
                    message: error.response.status + ': ' + error.message,
                    type: 'negative',
                    duration: 0,
                })
                break
        }
    }

    return Promise.reject(error)
})

axios.setToken = token => {
    axios.defaults.headers.common.Authorization = token
}

axios.setLoginRedirect = callback => {
    loginRedirect = callback
}

export default axios
