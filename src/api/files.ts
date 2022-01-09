import httpCrud from './http-crud'
import {
  FileQuery, FileResponse, UpdateFilePayload,
  SingleFileResponse
} from './types'

export default httpCrud<FileQuery, FileResponse, UpdateFilePayload, SingleFileResponse, FormData>('files')