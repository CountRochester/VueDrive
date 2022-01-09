import { AxiosResponse } from 'axios'

export type ApiFile = {
  id: number
  name: string
  url?: string
  mimeType?: string
  folderId?: number
}

export type ApiFolder = {
  id: number
  name: string
  folderId?: number
}

export type SortOrder = 'asc' | 'desc'
export type FileKeys = keyof ApiFile
export type FolderKeys = keyof ApiFolder

export type FileQuery = {
  _sort?: FileKeys
  _order?: SortOrder
  q?: string
  folderId?: string
}

export type FolderQuery = {
  _sort?: FolderKeys
  _order?: SortOrder
  q?: string
  folderId?: string
}

export type FileSortPayload = {
  column: FileKeys
  order: SortOrder
  q?: string
  folderId?: number
}

export type FileResponse = AxiosResponse<ApiFile[], any>
export type SingleFileResponse = AxiosResponse<ApiFile, any>

export type UpdateFilePayload = {
  id: number
  name?: string
  url?: string
  mimeType?: string
  folderId?: number
}

export type CreateFilePayload = Omit<UpdateFilePayload, 'id'>

export type FolderResponse = AxiosResponse<ApiFolder[], any>
export type SingleFolderResponse = AxiosResponse<ApiFolder, any>

export type UpdateFolderPayload = {
  id: number
  name?: string
  folderId?: number
}


type AxiosProgress = {
  lengthComputable: boolean
}

type AxiosProgressComputable = {
  lengthComputable: true
}

type AxiosProgressData = {
  loaded: number
  total: number
}

export type ProgressEvent = AxiosProgress & AxiosProgressData

export type DeleteApiFunction = (id: string|number) => Promise<SingleFileResponse|SingleFolderResponse>

export type CreateFolderPayload = {
  name: string,
  folderId: number|string
}

export type DeleteFromStarredFunction = (item: ApiFile|ApiFolder) => Promise<AxiosResponse<ApiFile|ApiFolder, any>>

export type ServerError = Error & {
  response: {
    status: number
  }
}
