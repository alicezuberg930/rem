import type { Media } from '@/@types/media'
import { FileImage, Folder } from 'lucide-react'
import { describe, expect, it } from 'vitest'
import {
  findFolderPath,
  getDroppedFiles,
  getMediaFileKind,
  getMediaItemColorClassName,
  getMediaItemIcon,
} from '@/lib/media'

const media = (overrides: Partial<Media> = {}): Media => ({
  id: 'media-1',
  createdAt: null,
  updatedAt: null,
  deletedAt: null,
  storageKey: 'files/media-1',
  name: 'file.txt',
  type: 'FILE',
  parentId: null,
  ownerId: null,
  size: 10,
  mimeType: 'text/plain',
  extension: 'txt',
  status: 'ACTIVE',
  owner: {},
  ...overrides,
})

describe('media file classification', () => {
  it.each([
    ['image/png', 'png', 'image'],
    ['video/mp4', 'mp4', 'video'],
    ['audio/mpeg', 'mp3', 'audio'],
    ['application/pdf', 'pdf', 'pdf'],
    ['text/csv', 'csv', 'csv'],
    ['application/vnd.ms-excel', 'xlsx', 'spreadsheet'],
    ['application/zip', 'zip', 'archive'],
    ['text/plain', 'tsx', 'code'],
    ['text/plain', 'Dockerfile', 'code'],
    ['text/plain', 'txt', 'text'],
    ['application/octet-stream', 'pptx', 'slideshow'],
    ['application/octet-stream', 'unknown', 'document'],
  ])('classifies %s .%s as %s', (mimeType, extension, expected) => {
    expect(getMediaFileKind(media({ mimeType, extension }))).toBe(expected)
  })

  it('uses folder and file-specific presentation metadata', () => {
    const folder = media({ type: 'FOLDER' })
    const image = media({ mimeType: 'image/png', extension: 'png' })

    expect(getMediaItemIcon(folder)).toBe(Folder)
    expect(getMediaItemColorClassName(folder)).toBe('text-amber-600')
    expect(getMediaItemIcon(image)).toBe(FileImage)
    expect(getMediaItemColorClassName(image)).toBe('text-pink-600')
  })
})

describe('media hierarchy and dropped files', () => {
  it('returns a root-to-child folder path', () => {
    const root = media({ id: 'root', type: 'FOLDER', name: 'Root' })
    const child = media({
      id: 'child',
      type: 'FOLDER',
      name: 'Child',
      parentId: 'root',
    })

    expect(findFolderPath([child, root], 'child')).toEqual([root, child])
    expect(findFolderPath([child, root], null)).toEqual([])
  })

  it('stops safely when a folder hierarchy contains a cycle', () => {
    const first = media({ id: 'first', type: 'FOLDER', parentId: 'second' })
    const second = media({ id: 'second', type: 'FOLDER', parentId: 'first' })

    expect(findFolderPath([first, second], 'first')).toHaveLength(2)
  })

  it('falls back to DataTransfer files when items are unavailable', async () => {
    const file = new File(['hello'], 'hello.txt')
    const transfer = {
      items: [],
      files: [file],
    } as unknown as DataTransfer

    await expect(getDroppedFiles(transfer)).resolves.toEqual([
      { file, relativePath: 'hello.txt' },
    ])
  })
})
