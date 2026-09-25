import type { ColumnDef } from '@tanstack/react-table'
import type { Media } from '@/@types/media'
import { fData } from '@/lib/format-number'
import { cn, getInitials } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { MediaRowActions } from './media-row-actions'
import { getMediaItemColorClassName, getMediaItemIcon } from './media-utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const getMediaTypeLabel = (media: Media) => {
  if (media.type === 'FOLDER') return 'Folder'
  return media.extension ? media.extension.toUpperCase() : media.mimeType
}

export const mediaColumns: ColumnDef<Media>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const item = row.original
      const Icon = getMediaItemIcon(item)

      return (
        <div className='flex min-w-0 items-center gap-3'>
          <div
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-md',
              getMediaItemColorClassName(item)
            )}
          >
            <Icon className='size-6' />
          </div>
          <div className='min-w-0'>
            <p className='truncate font-medium'>{item.name}</p>
            <p className='truncate text-xs text-muted-foreground md:hidden'>
              {getMediaTypeLabel(item)}
            </p>
          </div>
        </div>
      )
    },
    enableHiding: false,
  },
  {
    id: 'owner',
    accessorFn: (item) => item.owner.fullname ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Owner' />
    ),
    cell: ({ row }) => {
      const owner = row.original.owner
      return (
        <div className='flex min-w-0 items-center gap-2'>
          <Avatar size='sm'>
            <AvatarImage src={owner.avatar} alt={owner.fullname} />
            <AvatarFallback>{getInitials(owner.fullname!)}</AvatarFallback>
          </Avatar>
          <span className='truncate text-sm text-muted-foreground'>
            {owner.fullname}
          </span>
        </div>
      )
    },
    meta: {
      className: 'hidden md:table-cell',
    },
  },
  {
    id: 'type',
    accessorFn: getMediaTypeLabel,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => getMediaTypeLabel(row.original),
    meta: {
      className: 'hidden md:table-cell',
    },
  },
  {
    id: 'size',
    header: 'Size',
    cell: ({ row }) => row.original.type === 'FOLDER' ? '-' : fData(row.original.size),
    meta: {
      className: 'hidden text-muted-foreground sm:table-cell',
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: MediaRowActions,
    meta: {
      className: 'w-10',
    },
    enableSorting: false,
    enableHiding: false,
  },
]
