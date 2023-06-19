import Axios from 'axios'

export const API_BASE_URL = 'http://localhost:8080'
export const API_URL = `${API_BASE_URL}/api`
export const API_URL_PUBLIC = `${API_URL}/public`
export const API_URL_ADMIN = `${API_URL}/admin`
export const API_URL_MANAGER = `${API_URL}/manager`

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
