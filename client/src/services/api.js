import axios from 'axios'

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' })

export const signup = (data) => API.post('/auth/signup', data)
export const login = (data) => API.post('/auth/login', data)
export const getMessages = (token) => API.get('/messages', { headers: { Authorization: `Bearer ${token}` } })
export const postMessage = (token, text) => API.post('/messages', { text }, { headers: { Authorization: `Bearer ${token}` } })

export default API
