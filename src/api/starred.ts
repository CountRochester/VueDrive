import http from './http'
import { ApiFile, ApiFolder } from './types'

export const starredFiles = () => http.get<ApiFile[]>('/files?starred=true')

export const addFileToStarred = (file: ApiFile) => http.put<ApiFile>(`/files/${file.id}`, { ...file, starred: true })

export const removeFileFromStarred = (file: ApiFile) => http.put<ApiFile>(`/files/${file.id}`, { ...file, starred: false })

export const starredFolders = () => http.get<ApiFolder[]>('/folders?starred=true')

export const addFolderToStarred = (folder: ApiFolder) => http.put<ApiFolder>(`/folders/${folder.id}`, { ...folder, starred: true })

export const removeFolderFromStarred = (folder: ApiFolder) => http.put<ApiFolder>(`/folders/${folder.id}`, { ...folder, starred: false })
