import axios from 'axios'
import { API_URL } from '../config/api'

const http = axios.create({ baseURL: API_URL })

export default http
