export const iconTypes = {
  'video/mp4': 'icon-type-video',
  'image/jpeg': 'icon-type-image',
  'image/jpg': 'icon-type-image',
  'image/png': 'icon-type-image',
  'application/zip': 'icon-type-zip',
  'application/msword': 'icon-type-doc',
  'application/vnd.ms-excel': 'icon-type-excel',
  'application/pdf': 'icon-type-pdf',
  'default': 'icon-type-common'
} as const

export type IconType = ReturnType<() => typeof iconTypes[keyof typeof iconTypes]>
export type MimeType = ReturnType<() => keyof typeof iconTypes>
