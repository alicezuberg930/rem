import { type ColumnDef } from '@tanstack/react-table'
import { type User } from '@/@types/user'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

type UserStatus = 'active' | 'inactive'
type MembershipStatus = 'verified' | 'unverified'

const statusStyles = new Map<UserStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

const membershipStyles = new Map<MembershipStatus, string>([
  ['verified', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['unverified', 'bg-amber-100/40 text-amber-900 dark:text-amber-200 border-amber-200'],
])

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    meta: {
      className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]'),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullname',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.original.fullname}</LongText>
    ),
    meta: { className: 'w-36' },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => (
      <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
    enableSorting: false,
  },
  {
    id: 'status',
    accessorFn: (user) => user.isActive === true ? 'active' : 'inactive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.original.isActive === true ? 'active' : 'inactive'
      const badgeColor = statusStyles.get(status)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {row.getValue('status')}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'membershipVerified',
    accessorFn: (user) => user.membershipVerified === true ? 'verified' : 'unverified',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Membership' />
    ),
    cell: ({ row }) => {
      const membershipStatus = row.original.membershipVerified === true ? 'verified' : 'unverified'
      const badgeColor = membershipStyles.get(membershipStatus)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {membershipStatus}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableHiding: false,
    enableSorting: false,
  },
  {
    id: 'role',
    accessorFn: (user) => user.roleName?.toLowerCase() ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = row.getValue<string>('role')
      return (
        <div className='flex items-center'>
          <span className='text-sm capitalize'>{role || '—'}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
