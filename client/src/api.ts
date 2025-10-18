import axios from 'axios'
import { authHeaders } from './auth'

export const API = axios.create({
  baseURL: 'http://localhost:4000',
})

API.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...authHeaders() }
  return config
})
