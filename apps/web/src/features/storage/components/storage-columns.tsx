import type { ColumnDef } from '@tanstack/react-table'
import { Star, Users } from 'lucide-react'
import { fData } from '@/lib/format-number'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTableColumnHeader } from '@/components/data-table'
import { StorageRowActions } from './storage-row-actions'
import type { StorageItem, StorageOwner } from './storage-types'
import {
  getStorageItemColorClassName,
  getStorageItemIcon,
} from './storage-utils'

const getFolderItemCount = (items: StorageItem[]): number =>
  items.reduce((total, item) => {
    if (item.type === 'folder') {
      return total + 1 + getFolderItemCount(item.children)
    }

    return total + 1
  }, 0)

const getItemMeta = (item: StorageItem) => {
  if (item.type === 'folder') {
    const count = getFolderItemCount(item.children)
    return `${count} ${count === 1 ? 'item' : 'items'}`
  }

  return fData(item.size)
}

export const storageColumns: ColumnDef<StorageItem>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      const item = row.original
      const Icon = getStorageItemIcon(item)

      return (
        <div className='flex min-w-0 items-center gap-3'>
          <div
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-md',
              getStorageItemColorClassName(item)
            )}
          >
            <Icon className='size-6' />
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
              {item.owner.fullname} &middot; {item.updatedAt}
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
      const owner: StorageOwner = row.original.owner

      return (
        <div className='flex min-w-0 items-center gap-2'>
          <Avatar size='sm'>
            <AvatarImage src={owner.avatar} alt={owner.fullname} />
            <AvatarFallback>{owner.avatar}</AvatarFallback>
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
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Modified' />
    ),
    cell: ({ row }) => row.original.updatedAt,
    meta: {
      className: 'hidden text-muted-foreground lg:table-cell',
    },
  },
  {
    id: 'size',
    header: 'Size',
    cell: ({ row }) => getItemMeta(row.original),
    meta: {
      className: 'hidden text-muted-foreground sm:table-cell',
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: StorageRowActions,
    meta: {
      className: 'w-10',
    },
    enableSorting: false,
    enableHiding: false,
  },
]
