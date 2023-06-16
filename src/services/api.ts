import Axios from 'axios'

export const API_BASE_URL = 'http://localhost:8080'
export const API_URL = 'http://localhost:8080/api'
export const API_URL_PUBLIC = 'http://localhost:8080/api/public'
export const API_URL_ADMIN = 'http://localhost:8080/api/admin'
export const API_URL_MANAGER = 'http://localhost:8080/api/manager'

const api = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const apiFormData = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

export default api
