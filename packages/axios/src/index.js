import axios from 'axios'
import notification from '@ieremeev/notification'

axios.interceptors.response.use(null, error => {
    if (error && error.response) {
        switch (error.response.status) {
            case 401:
                if (!/auth\/local$/.test(error.response.config.url)) {
                    history.push('/login')
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

// Override some defaults
axios.defaults.baseURL = process.env.IEREMEEV_AXIOS_BASE_URL || ''

axios.setToken = token => {
    axios.defaults.headers.common.Authorization = token
}

export default axios
