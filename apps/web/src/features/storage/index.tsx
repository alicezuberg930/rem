import { useMemo, useState } from 'react'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { Archive, ChevronRight, FileUp, FolderPlus, FolderUp, Grid2X2, List, SearchIcon, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StorageProvider } from './components/storage-provider'
import { StorageRowActions } from './components/storage-row-actions'
import { StorageTable } from './components/storage-table'
import type { StorageFolder, StorageItem } from './components/storage-types'
import { getStorageItemColorClassName, getStorageItemIcon, } from './components/storage-utils'
import { StorageContextMenu } from './components/storage-context-menu'

type ViewMode = 'grid' | 'list'

const storageItems: StorageItem[] = [
  {
    id: 'folder-brand',
    type: 'folder',
    name: 'Brand Assets',
    updatedAt: 'Today, 9:48 AM',
    owner: { fullname: 'Avery Stone', avatar: 'AS' },
    starred: true,
    shared: true,
    children: [
      {
        id: 'file-logo',
        type: 'file',
        name: 'rem-logo-pack.zip',
        fileType: 'archive',
        size: 18200000,
        updatedAt: 'Today, 9:42 AM',
        owner: { fullname: 'Avery Stone', avatar: 'AS' },
        starred: true,
      },
      {
        id: 'file-guidelines',
        type: 'file',
        name: 'visual-guidelines.pdf',
        fileType: 'pdf',
        size: 8400000,
        updatedAt: 'Yesterday, 4:16 PM',
        owner: { fullname: 'Mina Lee', avatar: 'ML' },
        shared: true,
      },
      {
        id: 'folder-campaign-stills',
        type: 'folder',
        name: 'Campaign Stills',
        updatedAt: 'Sep 12, 2026',
        owner: { fullname: 'Mina Lee', avatar: 'ML' },
        children: [
          {
            id: 'file-hero-shot',
            type: 'file',
            name: 'hero-shot-final.png',
            fileType: 'image',
            size: 12400000,
            updatedAt: 'Sep 12, 2026',
            owner: { fullname: 'Mina Lee', avatar: 'ML' },
          },
          {
            id: 'file-product-grid',
            type: 'file',
            name: 'product-grid.jpg',
            fileType: 'image',
            size: 9300000,
            updatedAt: 'Sep 11, 2026',
            owner: { fullname: 'Avery Stone', avatar: 'AS' },
          },
        ],
      },
    ],
  },
  {
    id: 'folder-sales',
    type: 'folder',
    name: 'Sales Operations',
    updatedAt: 'Yesterday, 2:10 PM',
    owner: { fullname: 'Noah Kim', avatar: 'NK' },
    shared: true,
    children: [
      {
        id: 'file-q4-pipeline',
        type: 'file',
        name: 'q4-pipeline.xlsx',
        fileType: 'spreadsheet',
        size: 3200000,
        updatedAt: 'Yesterday, 2:04 PM',
        owner: { fullname: 'Noah Kim', avatar: 'NK' },
      },
      {
        id: 'file-territory-plan',
        type: 'file',
        name: 'territory-plan.docx',
        fileType: 'document',
        size: 960000,
        updatedAt: 'Sep 10, 2026',
        owner: { fullname: 'Rina Patel', avatar: 'RP' },
        starred: true,
      },
      {
        id: 'folder-renewals',
        type: 'folder',
        name: 'Renewals',
        updatedAt: 'Sep 7, 2026',
        owner: { fullname: 'Noah Kim', avatar: 'NK' },
        children: [
          {
            id: 'file-enterprise-renewals',
            type: 'file',
            name: 'enterprise-renewals.xlsx',
            fileType: 'spreadsheet',
            size: 2100000,
            updatedAt: 'Sep 7, 2026',
            owner: { fullname: 'Noah Kim', avatar: 'NK' },
          },
        ],
      },
    ],
  },
  {
    id: 'folder-legal',
    type: 'folder',
    name: 'Contracts',
    updatedAt: 'Sep 9, 2026',
    owner: { fullname: 'Harper Fox', avatar: 'HF' },
    children: [
      {
        id: 'file-vendor-msa',
        type: 'file',
        name: 'vendor-msa.pdf',
        fileType: 'pdf',
        size: 1500000,
        updatedAt: 'Sep 9, 2026',
        owner: { fullname: 'Harper Fox', avatar: 'HF' },
      },
      {
        id: 'file-dpa-template',
        type: 'file',
        name: 'dpa-template.docx',
        fileType: 'document',
        size: 620000,
        updatedAt: 'Sep 5, 2026',
        owner: { fullname: 'Harper Fox', avatar: 'HF' },
      },
    ],
  },
  {
    id: 'file-board-report',
    type: 'file',
    name: 'board-report-september.pdf',
    fileType: 'pdf',
    size: 5600000,
    updatedAt: 'Today, 8:30 AM',
    owner: { fullname: 'Iris Chen', avatar: 'IC' },
    starred: true,
    shared: true,
  },
  {
    id: 'file-launch-video',
    type: 'file',
    name: 'launch-recap.mp4',
    fileType: 'video',
    size: 148000000,
    updatedAt: 'Sep 13, 2026',
    owner: { fullname: 'Avery Stone', avatar: 'AS' },
  },
  {
    id: 'file-support-export',
    type: 'file',
    name: 'support-ticket-export.csv',
    fileType: 'spreadsheet',
    size: 4900000,
    updatedAt: 'Sep 8, 2026',
    owner: { fullname: 'Rina Patel', avatar: 'RP' },
  },
]

const findFolderPath = (
  items: StorageItem[],
  folderId: string,
  path: StorageFolder[] = []
): StorageFolder[] | null => {
  for (const item of items) {
    if (item.type !== 'folder') continue

    const nextPath = [...path, item]
    if (item.id === folderId) return nextPath

    const childPath = findFolderPath(item.children, folderId, nextPath)
    if (childPath) return childPath
  }

  return null
}

const getCurrentItems = (folderId: string | null): StorageItem[] => {
  if (!folderId) return storageItems

  const folderPath = findFolderPath(storageItems, folderId)
  return folderPath?.[folderPath.length - 1]?.children ?? storageItems
}

const getFolderPath = (folderId: string | null): StorageFolder[] => folderId ? (findFolderPath(storageItems, folderId) ?? []) : []

const sortStorageItems = (items: StorageItem[]) =>
  [...items].sort((first, second) => {
    if (first.type !== second.type) return first.type === 'folder' ? -1 : 1
    return first.name.localeCompare(second.name)
  })

export function Storage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [query, setQuery] = useState('')

  const currentItems = useMemo(() => getCurrentItems(currentFolderId), [currentFolderId])
  const folderPath = useMemo(() => getFolderPath(currentFolderId), [currentFolderId])
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const visibleItems = normalizedQuery
      ? currentItems.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
      : currentItems
    return sortStorageItems(visibleItems)
  }, [currentItems, query])

  // const folderCount = currentItems.filter((item) => item.type === 'folder').length
  // const fileCount = currentItems.length - folderCount
  // const currentFolderSize = getFolderSize(currentItems)

  const openFolder = (item: StorageItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id)
      setQuery('')
    }
  }

  return (
    <>
      <StorageProvider>
        <Header fixed>
          <Search />
          <ClockInButton />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>

        <StorageContextMenu>
          <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <div className='flex flex-wrap items-end justify-between gap-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Storage Management
                </h2>
                <p className='text-muted-foreground'>
                  Manage storage & files for the current business.
                </p>
              </div>
              {/* <StoragePrimaryButtons /> */}
            </div>

            <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex min-w-0 flex-wrap items-center gap-1 text-sm'>
                <Button
                  variant='ghost'
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
                      variant='ghost'
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
                <Button>
                  <Upload data-icon='inline-start' />
                  Upload
                </Button>
              </div>
            </div>
            {viewMode === 'grid' ? (
              <StorageGrid data={filteredItems} onOpenFolder={openFolder} />
            ) : (
              <StorageTable data={filteredItems} onOpenFolder={openFolder} />
            )}
          </Main>
        </StorageContextMenu>
        {/* <StorageDialogs /> */}
      </StorageProvider>
    </>
  )
}

type StorageViewProps = {
  data: StorageItem[]
  onOpenFolder: (item: StorageItem) => void
}

const StorageGrid = ({ data, onOpenFolder }: StorageViewProps) => {
  if (!data.length) return <StorageEmptyState />

  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {data.map((item) => {
        const Icon = getStorageItemIcon(item)

        return (
          <button
            key={item.id}
            type='button'
            onDoubleClick={() => onOpenFolder(item)}
            onClick={() => item.type === 'folder' && onOpenFolder(item)}
            className='aspect-square rounded-md border p-2 text-left shadow-xs transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
          >
            <div className='mb-2 flex items-center justify-start gap-3'>
              <div
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-md',
                  getStorageItemColorClassName(item)
                )}
              >
                <Icon className='size-6' />
              </div>
              <p className='flex-auto truncate'>{item.name}</p>
              {/* options icon */}
              <StorageRowActions item={item} />
            </div>
            <div className='h-full w-full rounded-md bg-foreground/10'></div>
          </button>
        )
      })}
    </div>
  )
}

const StorageEmptyState = () => (
  <div className='flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed p-6 text-center'>
    <Archive className='mb-3 size-10 text-muted-foreground' />
    <p className='font-medium'>No items found</p>
    <p className='mt-1 text-sm text-muted-foreground'>
      Try another search or open a different folder.
    </p>
  </div>
)
