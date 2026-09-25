import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import type { Media, MediaUploadItem } from '@/@types/media'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { ChevronRight, Grid2X2, List, SearchIcon, Upload } from 'lucide-react'
import { medias } from '@/lib/queries/media'
import { HttpError } from '@/lib/repository/http-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { MediaContextMenu } from './components/media-context-menu'
import { MediaProvider } from './components/media-provider'
import { MediaTable } from './components/media-table'
import { MediaGrid } from './components/media-grid'
import { findFolderPath, getDroppedFiles } from './components/media-utils'
import { MediaViewer } from './components/media-viewer'

type ViewMode = 'grid' | 'list'

export function Media() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [query, setQuery] = useState<string>('')
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragDepthRef = useRef<number>(0)
  const mediaQuery = useInfiniteQuery(medias().all.infiniteQueryOptions({ pageSize: 24 }))
  const { mutateAsync, isPending: isUploading } = useMutation(medias().upload.mutationOptions())
  const mediaPages = mediaQuery.data?.pages
  const mediaItems = useMemo(() => mediaPages?.flatMap((page) => page.content) ?? [], [mediaPages])
  const currentItems = useMemo(() => mediaItems.filter((item) => item.parentId === currentFolderId), [currentFolderId, mediaItems])
  const folderPath = useMemo(() => findFolderPath(mediaItems, currentFolderId), [currentFolderId, mediaItems])
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const visibleItems = normalizedQuery ? currentItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery)) : currentItems
    return visibleItems.sort((first, second) => {
      if (first.type !== second.type) return first.type === 'FOLDER' ? -1 : 1
      return first.name.localeCompare(second.name)
    })
  }, [currentItems, query])
  const { mutate: preview, data } = useMutation(medias().preview.mutationOptions())

  const onDoubleClick = (item: Media) => {
    if (item.type === 'FOLDER') {
      setCurrentFolderId(item.id)
      setQuery('')
    }
    if (item.type === 'FILE') {
      preview(item.id)
    }
  }

  const uploadFiles = async (items: MediaUploadItem[]) => {
    if (!items.length) {
      toast.message('No files found to upload')
      return
    }

    toast.promise(mutateAsync({ items, parentId: currentFolderId }), {
      loading: items.length === 1 ? 'Uploading file' : `Uploading ${items.length} files`,
      success: (data) => data.message,
      error: (error) => error instanceof HttpError ? error.message : 'Internal server error',
    })
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const items = Array.from(event.currentTarget.files ?? [], (file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
    }))
    event.currentTarget.value = ''
    uploadFiles(items)
  }

  const handleDragEnter = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    if (!event.dataTransfer.types.includes('Files')) return
    dragDepthRef.current += 1
    setIsDraggingFile(true)
  }

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) setIsDraggingFile(false)
  }

  const handleDrop = async (event: DragEvent<HTMLElement>) => {
    event.preventDefault()
    dragDepthRef.current = 0
    setIsDraggingFile(false)
    const items = await getDroppedFiles(event.dataTransfer)
    uploadFiles(items)
  }

  return (
    <>
      <Header fixed>
        <Search />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <MediaProvider>
        <MediaContextMenu>
          <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <div className='flex flex-wrap items-end justify-between gap-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Media Management
                </h2>
                <p className='text-muted-foreground'>
                  Manage media & files for the current business.
                </p>
              </div>
              {/* <MediaPrimaryButtons /> */}
            </div>

            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex min-w-0 flex-wrap items-center gap-1 text-sm'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setCurrentFolderId(null)
                    setQuery('')
                  }}
                >
                  My Drive
                </Button>
                {folderPath.map((folder) => (
                  <div
                    key={folder.id}
                    className='flex min-w-0 items-center gap-1'
                  >
                    <ChevronRight className='size-4 shrink-0 text-muted-foreground' />
                    <Button
                      variant='outline'
                      size='sm'
                      className='max-w-48'
                      onClick={() => {
                        setCurrentFolderId(folder.id)
                        setQuery('')
                      }}
                    >
                      <span className='truncate'>{folder.name}</span>
                    </Button>
                  </div>
                ))}
              </div>

              <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                <div className='relative min-w-0 sm:w-64'>
                  <SearchIcon className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder='Search in this folder'
                    className='pl-8'
                  />
                </div>
                <div className='inline-flex rounded-md border'>
                  <Button
                    aria-label='Grid view'
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size='icon-sm'
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid2X2 />
                  </Button>
                  <Button
                    aria-label='List view'
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size='icon-sm'
                    onClick={() => setViewMode('list')}
                  >
                    <List />
                  </Button>
                </div>
                <Button
                  type='button'
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type='file'
                    multiple
                    className='sr-only'
                    onChange={handleFileChange}
                  />
                  <Upload data-icon='inline-start' />
                  Upload
                </Button>
              </div>
            </div>
            <div
              className='relative h-full w-full'
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDraggingFile && (
                <div className='pointer-events-none absolute inset-0 z-20 flex items-end justify-center rounded-md border-2 border-dashed border-primary backdrop-blur-xs'>
                  <Card className='-translate-y-6'>
                    <CardContent>
                      <Upload
                        className='mx-auto mb-4 animate-bounce'
                        size={42}
                      />
                      <p>Drop files/folders to upload</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              {mediaQuery.isPending ? (
                <div className='flex min-h-64 items-center justify-center'>
                  <Spinner className='size-6' />
                </div>
              ) : mediaQuery.isError && !mediaQuery.data ? (
                <div className='flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center'>
                  <p className='font-medium'>Unable to load media</p>
                  <p className='mt-1 text-sm text-muted-foreground'>
                    Please try again.
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    className='mt-4'
                    onClick={() => mediaQuery.refetch()}
                  >
                    Retry
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                <MediaGrid
                  data={filteredItems}
                  hasNextPage={mediaQuery.hasNextPage}
                  isFetchingNextPage={mediaQuery.isFetchingNextPage}
                  isLoadMoreError={mediaQuery.isFetchNextPageError}
                  onLoadMore={mediaQuery.fetchNextPage}
                  onDoubleClick={onDoubleClick}
                />
              ) : (
                <MediaTable
                  data={filteredItems}
                  hasNextPage={mediaQuery.hasNextPage}
                  isFetchingNextPage={mediaQuery.isFetchingNextPage}
                  isLoadMoreError={mediaQuery.isFetchNextPageError}
                  onLoadMore={mediaQuery.fetchNextPage}
                  onDoubleClick={onDoubleClick}
                />
              )}
            </div>
          </Main>
        </MediaContextMenu>
        <MediaViewer url={data?.data.previewUrl} />
        {/* <MediaDialogs /> */}
      </MediaProvider>
    </>
  )
}