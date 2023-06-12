import Axios from 'axios'

export const API_BASE_URL = 'http://localhost:8080'

const api = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default api
