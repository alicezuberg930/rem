import {
  type File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
} from 'lucide-react'
import type { StorageFile, StorageItem } from './storage-types'

export const getStorageItemIcon = (item: StorageItem) => {
  if (item.type === 'folder') return Folder

  const fileTypeIcons: Record<StorageFile['fileType'], typeof File> = {
    archive: FileArchive,
    document: FileText,
    image: FileImage,
    pdf: FileText,
    spreadsheet: FileSpreadsheet,
    video: FileVideo,
  }

  return fileTypeIcons[item.fileType]
}

export const getStorageItemColorClassName = (item: StorageItem) => {
  if (item.type === 'folder') return 'text-amber-600'

  const fileTypeColors: Record<StorageFile['fileType'], string> = {
    archive: 'text-slate-600',
    document: 'text-sky-600',
    image: 'text-pink-600',
    pdf: 'text-red-600',
    spreadsheet: 'text-emerald-600',
    video: 'text-violet-600',
  }

  return fileTypeColors[item.fileType]
}
