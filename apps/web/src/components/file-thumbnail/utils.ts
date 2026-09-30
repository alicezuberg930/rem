import { type ExtendFile } from './types'

// Define more formats here
const FORMAT_PDF = ['pdf']
const FORMAT_TEXT = ['txt']
const FORMAT_PHOTOSHOP = ['psd']
const FORMAT_WORD = ['doc', 'docx']
const FORMAT_EXCEL = ['xls', 'xlsx']
const FORMAT_ZIP = ['zip', 'rar', 'iso']
const FORMAT_ILLUSTRATOR = ['ai', 'esp']
const FORMAT_POWERPOINT = ['ppt', 'pptx']
const FORMAT_AUDIO = ['wav', 'aif', 'mp3', 'aac']
const FORMAT_IMG = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'jfif', 'webp']
const FORMAT_VIDEO = ['m4v', 'avi', 'mpg', 'mp4', 'webm']

const iconUrl = (icon: string) => `/assets/icons/files/${icon}.svg`

// get file types based on format
export function fileFormat(fileUrl: string | undefined) {
  const extension = fileTypeByUrl(fileUrl)

  if (FORMAT_TEXT.includes(extension)) return 'txt'
  if (FORMAT_ZIP.includes(extension)) return 'zip'
  if (FORMAT_AUDIO.includes(extension)) return 'audio'
  if (FORMAT_IMG.includes(extension)) return 'image'
  if (FORMAT_VIDEO.includes(extension)) return 'video'
  if (FORMAT_WORD.includes(extension)) return 'word'
  if (FORMAT_EXCEL.includes(extension)) return 'excel'
  if (FORMAT_POWERPOINT.includes(extension)) return 'powerpoint'
  if (FORMAT_PDF.includes(extension)) return 'pdf'
  if (FORMAT_PHOTOSHOP.includes(extension)) return 'photoshop'
  if (FORMAT_ILLUSTRATOR.includes(extension)) return 'illustrator'
  return extension
}

// get thumbnail based on file type
export function fileThumb(fileUrl: string) {
  let thumb: string

  switch (fileFormat(fileUrl)) {
    case 'folder':
      thumb = iconUrl('ic_folder')
      break
    case 'txt':
      thumb = iconUrl('ic_txt')
      break
    case 'zip':
      thumb = iconUrl('ic_zip')
      break
    case 'audio':
      thumb = iconUrl('ic_audio')
      break
    case 'video':
      thumb = iconUrl('ic_video')
      break
    case 'word':
      thumb = iconUrl('ic_word')
      break
    case 'excel':
      thumb = iconUrl('ic_excel')
      break
    case 'powerpoint':
      thumb = iconUrl('ic_power_point')
      break
    case 'pdf':
      thumb = iconUrl('ic_pdf')
      break
    case 'photoshop':
      thumb = iconUrl('ic_pts')
      break
    case 'illustrator':
      thumb = iconUrl('ic_ai')
      break
    case 'image':
      thumb = iconUrl('ic_img')
      break
    default:
      thumb = iconUrl('ic_file')
  }
  return thumb
}

export function fileTypeByUrl(fileUrl = '') {
  const path = fileUrl.split(/[?#]/, 1)[0]
  const fileName = path.split('/').pop() || ''
  const extensionIndex = fileName.lastIndexOf('.')
  return (extensionIndex === -1
    ? fileName
    : fileName.slice(extensionIndex + 1)
  ).toLowerCase()
}

export function fileNameByUrl(fileUrl: string) {
  return fileUrl.split(/[?#]/, 1)[0].split('/').pop()
}

export function fileData(file: ExtendFile | string) {
  // Url
  if (typeof file === 'string') {
    return {
      key: file,
      preview: file,
      name: fileNameByUrl(file),
      type: fileTypeByUrl(file),
    }
  }

  // File
  return {
    key: file.preview,
    name: file.name,
    size: file.size,
    path: file.path,
    type: file.type,
    preview: file.preview,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
  }
}
