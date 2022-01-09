import { ResponseType } from 'axios'
import { ApiFile } from '../../api/types'

export const uploadStates = {
  WAITING: 'waiting',
  UPLOADING: 'uploading',
  COMPLETE: 'complete',
  CANCELED: 'canceled',
  FAILED: 'failed'
} as const

export type UploadStates = ReturnType<() => typeof uploadStates[keyof typeof uploadStates]>

export type UploadItem = {
  id: number|string,
  file: File,
  progress: number,
  state: UploadStates,
  response: null | ApiFile,
  folderId: string|number
}
