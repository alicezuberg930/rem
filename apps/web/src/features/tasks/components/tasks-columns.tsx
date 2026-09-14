import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { TASK_PRIORITY, TASK_STATUS, type Task } from '@/@types'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronsDown,
  ChevronsUp,
  type LucideIcon,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { Checkbox } from '@/components/ui/checkbox'
import { ContactRowActions } from './data-table-row-actions'

export const taskPriorities = [
  {
    label: TASK_PRIORITY.LOWEST,
    value: 'LOWEST',
    icon: ChevronsDown,
  },
  {
    label: TASK_PRIORITY.LOW,
    value: 'LOW',
    icon: ArrowDown,
  },
  {
    label: TASK_PRIORITY.MEDIUM,
    value: 'MEDIUM',
    icon: ArrowRight,
  },
  {
    label: TASK_PRIORITY.HIGH,
    value: 'HIGH',
    icon: ArrowUp,
  },
  {
    label: TASK_PRIORITY.HIGHEST,
    value: 'HIGHEST',
    icon: ChevronsUp,
  },
]

export const taskStatuses: {
  label: string
  value: string
  icon?: LucideIcon
}[] = Object.entries(TASK_STATUS).map(([value, label]) => ({
  label,
  value,
}))

export const tasksColumns: ColumnDef<Task>[] = [
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
    accessorKey: 'assignee',
    accessorFn: (task) => task.assignee?.fullname ?? '',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Assignee' />
    ),
    cell: ({ row }) => {
      const { assignee } = row.original

      if (!assignee) {
        return <LongText className=''>Unassigned</LongText>
      }

      const assigneeName = assignee.fullname?.trim() || 'Unknown user'

      return (
        <div className='flex min-w-40 items-center gap-2'>
          <Avatar size='sm'>
            {assignee.avatar && (
              <AvatarImage src={assignee.avatar} alt={assigneeName} />
            )}
            <AvatarFallback>{getInitials(assigneeName)}</AvatarFallback>
          </Avatar>
          <LongText className='max-w-44'>{assigneeName}</LongText>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-80 font-medium'>
        {row.original.title ?? '-'}
      </LongText>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Priority' />
    ),
    cell: ({ row }) => {
      const priority = taskPriorities.find(
        (item) => item.value === row.original.priority
      )

      if (!priority) {
        return <span className='text-muted-foreground'>-</span>
      }

      const PriorityIcon = priority.icon

      return (
        <Badge variant='outline' className='gap-1.5 font-normal'>
          <PriorityIcon className='size-3.5 text-muted-foreground' />
          {priority.label}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='gap-1.5 font-normal'>
        {row.original.status ? TASK_STATUS[row.original.status] : '-'}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start date' />
    ),
    cell: ({ row }) => (
      <LongText>
        {row.original.startDate
          ? format(row.original.startDate, 'dd-MM-yyyy')
          : '-'}
      </LongText>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Due date' />
    ),
    cell: ({ row }) => (
      <LongText>
        {row.original.dueDate
          ? format(row.original.dueDate, 'dd-MM-yyyy')
          : '-'}
      </LongText>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ContactRowActions,
  },
]
