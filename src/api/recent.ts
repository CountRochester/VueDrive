import http from './http'
import { ApiFile } from './types'

export const recentFiles = () => http.get<ApiFile[]>('/files?sort=createdAt&_order=desc')
