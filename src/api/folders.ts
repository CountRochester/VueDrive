import httpCrud from './http-crud'
import {
  FolderQuery, FileQuery, FolderResponse, UpdateFolderPayload,
  SingleFolderResponse, CreateFolderPayload
} from './types'

export default httpCrud<FolderQuery | FileQuery, FolderResponse, UpdateFolderPayload, SingleFolderResponse, CreateFolderPayload>('folders')
