import { useMemo, useState } from 'react'
import {
  Archive,
  ChevronRight,
  Clock,
  Download,
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  Grid2X2,
  HardDrive,
  LayoutList,
  MoreVertical,
  SearchIcon,
  Share2,
  Star,
  Upload,
  Users,
} from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { fData } from '@/lib/format-number'
import { User } from '@/@types'

type StorageOwner = Partial<User>

type StorageBaseItem = {
  id: string
  name: string
  updatedAt: string
  owner: StorageOwner
  starred?: boolean
  shared?: boolean
}

type StorageFile = StorageBaseItem & {
  type: 'file'
  fileType: 'document' | 'spreadsheet' | 'image' | 'video' | 'archive' | 'pdf'
  size: number
}

type StorageFolder = StorageBaseItem & {
  type: 'folder'
  children: StorageItem[]
}

type StorageItem = StorageFile | StorageFolder

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

const getItemIcon = (item: StorageItem) => {
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

const getItemColorClassName = (item: StorageItem) => {
  if (item.type === 'folder') return 'bg-amber-500/10 text-amber-600'

  const fileTypeColors: Record<StorageFile['fileType'], string> = {
    archive: 'bg-slate-500/10 text-slate-600',
    document: 'bg-sky-500/10 text-sky-600',
    image: 'bg-pink-500/10 text-pink-600',
    pdf: 'bg-red-500/10 text-red-600',
    spreadsheet: 'bg-emerald-500/10 text-emerald-600',
    video: 'bg-violet-500/10 text-violet-600',
  }

  return fileTypeColors[item.fileType]
}

// const formatBytes = (bytes: number) => {
//   if (!bytes) return '0 B'

//   const units = ['B', 'KB', 'MB', 'GB']
//   const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
//   const value = bytes / 1024 ** unitIndex

//   return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
// }

const getFolderSize = (items: StorageItem[]): number =>
  items.reduce((total, item) => {
    if (item.type === 'folder') return total + getFolderSize(item.children)
    return total + item.size
  }, 0)

const getFolderItemCount = (items: StorageItem[]): number =>
  items.reduce((total, item) => {
    if (item.type === 'folder') return total + 1 + getFolderItemCount(item.children)
    return total + 1
  }, 0)

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

const getFolderPath = (folderId: string | null): StorageFolder[] =>
  folderId ? findFolderPath(storageItems, folderId) ?? [] : []

const sortStorageItems = (items: StorageItem[]) =>
  [...items].sort((first, second) => {
    if (first.type !== second.type) return first.type === 'folder' ? -1 : 1
    return first.name.localeCompare(second.name)
  })

const getItemMeta = (item: StorageItem) => {
  if (item.type === 'folder') {
    const count = getFolderItemCount(item.children)
    return `${count} ${count === 1 ? 'item' : 'items'}`
  }

  return fData(item.size)
}

export function Storage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [query, setQuery] = useState('')

  const currentItems = useMemo(
    () => getCurrentItems(currentFolderId),
    [currentFolderId]
  )
  const folderPath = useMemo(
    () => getFolderPath(currentFolderId),
    [currentFolderId]
  )
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const visibleItems = normalizedQuery
      ? currentItems.filter((item) =>
        item.name.toLowerCase().includes(normalizedQuery)
      )
      : currentItems

    return sortStorageItems(visibleItems)
  }, [currentItems, query])

  const folderCount = currentItems.filter((item) => item.type === 'folder').length
  const fileCount = currentItems.length - folderCount
  // const currentFolderSize = getFolderSize(currentItems)

  const openFolder = (item: StorageItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id)
      setQuery('')
    }
  }

  return (
    <>
      {/* <StorageProvider> */}
      <Header fixed>
        <Search />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

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
              <div key={folder.id} className='flex min-w-0 items-center gap-1'>
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
            <div className='inline-flex h-9 rounded-md border bg-background p-0.5'>
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
                <LayoutList />
              </Button>
            </div>
            <Button>
              <Upload data-icon='inline-start' />
              Upload
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <StorageGrid items={filteredItems} onOpenFolder={openFolder} />
        ) : (
          <StorageList items={filteredItems} onOpenFolder={openFolder} />
        )}
      </Main>
      {/* <StorageDialogs /> */}
      {/* </StorageProvider > */}
    </>
  )
}

type StorageViewProps = {
  items: StorageItem[]
  onOpenFolder: (item: StorageItem) => void
}

const StorageGrid = ({ items, onOpenFolder }: StorageViewProps) => {
  if (!items.length) return <StorageEmptyState />

  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {items.map((item) => {
        const Icon = getItemIcon(item)

        return (
          <button
            key={item.id}
            type='button'
            onDoubleClick={() => onOpenFolder(item)}
            onClick={() => item.type === 'folder' && onOpenFolder(item)}
            className='group min-h-40 rounded-md border bg-background p-3 text-left shadow-xs transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
          >
            <div className='mb-3 flex items-start justify-between gap-3'>
              <div
                className={cn(
                  'flex size-11 shrink-0 items-center justify-center rounded-md',
                  getItemColorClassName(item)
                )}
              >
                <Icon className='size-6' />
              </div>
              <StorageActions />
            </div>
            <div className='space-y-3'>
              <div className='min-w-0'>
                <p className='truncate font-medium'>{item.name}</p>
                <p className='truncate text-sm text-muted-foreground'>
                  {item.updatedAt}
                </p>
              </div>
              <div className='flex items-center justify-between gap-2'>
                <StorageOwner owner={item.owner} />
                <div className='flex items-center gap-1 text-muted-foreground'>
                  {item.starred && <Star className='size-4 fill-current' />}
                  {item.shared && <Users className='size-4' />}
                </div>
              </div>
              <p className='text-sm text-muted-foreground'>{getItemMeta(item)}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

const StorageList = ({ items, onOpenFolder }: StorageViewProps) => {
  if (!items.length) return <StorageEmptyState />

  return (
    <div className='rounded-md border bg-background shadow-xs'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className='hidden md:table-cell'>Owner</TableHead>
            <TableHead className='hidden lg:table-cell'>Modified</TableHead>
            <TableHead className='hidden sm:table-cell'>Size</TableHead>
            <TableHead className='w-10'>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const Icon = getItemIcon(item)

            return (
              <TableRow
                key={item.id}
                className={cn(item.type === 'folder' && 'cursor-pointer')}
                onDoubleClick={() => onOpenFolder(item)}
                onClick={() => item.type === 'folder' && onOpenFolder(item)}
              >
                <TableCell>
                  <div className='flex min-w-0 items-center gap-3'>
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-md',
                        getItemColorClassName(item)
                      )}
                    >
                      <Icon className='size-5' />
                    </div>
                    <div className='min-w-0'>
                      <div className='flex min-w-0 items-center gap-1.5'>
                        <p className='truncate font-medium'>{item.name}</p>
                        {item.starred && (
                          <Star className='size-3.5 shrink-0 fill-current text-muted-foreground' />
                        )}
                        {item.shared && (
                          <Users className='size-3.5 shrink-0 text-muted-foreground' />
                        )}
                      </div>
                      <p className='truncate text-xs text-muted-foreground md:hidden'>
                        {item.owner.fullname} · {item.updatedAt}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <StorageOwner owner={item.owner} />
                </TableCell>
                <TableCell className='hidden text-muted-foreground lg:table-cell'>
                  {item.updatedAt}
                </TableCell>
                <TableCell className='hidden text-muted-foreground sm:table-cell'>
                  {getItemMeta(item)}
                </TableCell>
                <TableCell>
                  <StorageActions />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

const StorageOwner = ({ owner }: { owner: StorageOwner }) => (
  <div className='flex min-w-0 items-center gap-2'>
    <Avatar size='sm'>
      <AvatarImage src={owner.avatar} alt={owner.fullname} />
      <AvatarFallback>{owner.avatar}</AvatarFallback>
    </Avatar>
    <span className='truncate text-sm text-muted-foreground'>{owner.fullname}</span>
  </div>
)

const StorageActions = () => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger>
      <Button
        aria-label='Open item actions'
        variant='ghost'
        size='icon-sm'
        onClick={(event) => event.stopPropagation()}
      >
        <MoreVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' onClick={(event) => event.stopPropagation()}>
      <DropdownMenuItem>
        <Share2 />
        Share
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Star />
        Add star
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Download />
        Download
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <Clock />
        Activity
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
)

const StorageEmptyState = () => (
  <div className='flex min-h-64 flex-col items-center justify-center rounded-md border border-dashed bg-background p-6 text-center'>
    <Archive className='mb-3 size-10 text-muted-foreground' />
    <p className='font-medium'>No items found</p>
    <p className='mt-1 text-sm text-muted-foreground'>
      Try another search or open a different folder.
    </p>
  </div>
)
