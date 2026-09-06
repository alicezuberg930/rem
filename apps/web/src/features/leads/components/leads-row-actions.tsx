import type { Row } from '@tanstack/react-table'
import type { Lead } from '@/@types'
import { CheckCircle2, EllipsisVertical, Trash2, UserPen } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { leads } from '@/lib/queries/lead'
import { HttpError } from '@/lib/repository/http-error'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLeads } from './leads-provider'

type LeadsRowActionsProps = {
  row: Row<Lead>
}

export function LeadsRowActions({ row }: LeadsRowActionsProps) {
  const { setOpen, setCurrentRow } = useLeads()
  const convert = useMutation(leads().convert.mutationOptions())

  const handleConvert = () => {
    const submit = () => convert.mutateAsync([row.original.id])
    toast.promise(submit, {
      loading: 'Converting lead',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (response) => response.message,
    })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <EllipsisVertical className='h-4 w-4' />
          <span className='sr-only'>Open lead actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem
          disabled={row.original.status === 'CONVERTED' || convert.isPending}
          onClick={handleConvert}
        >
          Convert
          <DropdownMenuShortcut>
            <CheckCircle2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('edit')
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <UserPen size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen('delete')
          }}
          className='text-red-500!'
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
