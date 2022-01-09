import { iconTypes, IconType, MimeType } from '../files/types'

export const getIconFileType = (type: string|undefined): IconType => {
  if (!type) {
    return iconTypes.default
  }
  return iconTypes[type as MimeType] || iconTypes.default
}
