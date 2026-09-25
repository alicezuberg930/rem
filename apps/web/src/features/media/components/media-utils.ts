import type { Media, MediaUploadItem } from '@/@types/media'
import {
  type File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
} from 'lucide-react'

type MediaFileKind =
  | 'archive'
  | 'document'
  | 'image'
  | 'pdf'
  | 'spreadsheet'
  | 'video'

const getMediaFileKind = (media: Media): MediaFileKind => {
  const extension = media.extension.toLowerCase()
  const mimeType = media.mimeType.toLowerCase()

  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType === 'application/pdf' || extension === 'pdf') return 'pdf'
  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    mimeType === 'text/csv' ||
    ['csv', 'xls', 'xlsx'].includes(extension)
  ) {
    return 'spreadsheet'
  }
  if (
    mimeType.includes('zip') ||
    mimeType.includes('compressed') ||
    ['7z', 'rar', 'tar', 'zip'].includes(extension)
  ) {
    return 'archive'
  }

  return 'document'
}

const fileTypeIcons: Record<MediaFileKind, typeof File> = {
  archive: FileArchive,
  document: FileText,
  image: FileImage,
  pdf: FileText,
  spreadsheet: FileSpreadsheet,
  video: FileVideo,
}

const fileTypeColors: Record<MediaFileKind, string> = {
  archive: 'text-slate-600',
  document: 'text-sky-600',
  image: 'text-pink-600',
  pdf: 'text-red-600',
  spreadsheet: 'text-emerald-600',
  video: 'text-violet-600',
}

export const getMediaItemIcon = (item: Media) => {
  if (item.type === 'FOLDER') return Folder

  return fileTypeIcons[getMediaFileKind(item)]
}

export const getMediaItemColorClassName = (item: Media) => {
  if (item.type === 'FOLDER') return 'text-amber-600'

  return fileTypeColors[getMediaFileKind(item)]
}

const readFileEntry = (entry: FileSystemFileEntry) => new Promise<File>((resolve, reject) => entry.file(resolve, reject))

const readDirectoryEntries = (entry: FileSystemDirectoryEntry) =>
  new Promise<FileSystemEntry[]>((resolve, reject) => {
    const reader = entry.createReader()
    const entries: FileSystemEntry[] = []

    const readBatch = () => {
      reader.readEntries((batch) => {
        if (!batch.length) {
          resolve(entries)
          return
        }

        entries.push(...batch)
        readBatch()
      }, reject)
    }

    readBatch()
  })

const readEntryFiles = async (entry: FileSystemEntry): Promise<MediaUploadItem[]> => {
  if (entry.isFile) {
    const file = await readFileEntry(entry as FileSystemFileEntry)
    return [
      {
        file,
        relativePath: entry.fullPath.replace(/^\/+/, '') || file.name,
      },
    ]
  }

  if (!entry.isDirectory) return []

  const entries = await readDirectoryEntries(entry as FileSystemDirectoryEntry)
  const nestedFiles = await Promise.all(entries.map(readEntryFiles))
  return nestedFiles.flat()
}

export const getDroppedFiles = async (dataTransfer: DataTransfer) => {
  const items = Array.from(dataTransfer.items)
  if (!items.length) {
    return Array.from(dataTransfer.files, (file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
    }))
  }

  const droppedFiles = await Promise.all(items
    .filter((item) => item.kind === 'file')
    .map(async (item) => {
      const entry = item.webkitGetAsEntry()
      if (!entry) {
        const file = item.getAsFile()
        return file
          ? [
            {
              file,
              relativePath: file.webkitRelativePath || file.name,
            },
          ]
          : []
      }

      return readEntryFiles(entry)
    })
  )

  return droppedFiles.flat()
}

export const findFolderPath = (items: Media[], folderId: string | null): Media[] => {
  if (!folderId) return []
  const mediaById = new Map(items.map((item) => [item.id, item]))
  const visitedIds = new Set<string>()
  const path: Media[] = []
  let folder = mediaById.get(folderId)
  while (folder?.type === 'FOLDER' && !visitedIds.has(folder.id)) {
    visitedIds.add(folder.id)
    path.unshift(folder)
    folder = folder.parentId ? mediaById.get(folder.parentId) : undefined
  }
  return path
}