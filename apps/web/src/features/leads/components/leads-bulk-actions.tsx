import type { Table } from '@tanstack/react-table'
import type { Lead } from '@/@types'
import { CheckCircle2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { leads } from '@/lib/queries/lead'
import { HttpError } from '@/lib/repository/http-error'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

type LeadsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function LeadsBulkActions<TData>({
  table,
}: LeadsBulkActionsProps<TData>) {
  const convert = useMutation(leads().convert.mutationOptions())
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleConvert = () => {
    const leadIds = selectedRows
      .map((row) => row.original as Lead)
      .filter((lead) => lead.status !== 'CONVERTED')
      .map((lead) => lead.id)
    if (!leadIds.length) return

    const submit = () => convert.mutateAsync(leadIds)
    toast.promise(submit, {
      loading: 'Converting leads',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (response) => {
        table.resetRowSelection()
        return response.message
      },
    })
  }

  return (
    <BulkActionsToolbar table={table} entityName='lead'>
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant='outline'
            size='icon'
            onClick={handleConvert}
            disabled={convert.isPending}
            className='size-8'
          >
            <CheckCircle2 />
            <span className='sr-only'>Convert selected leads</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Convert selected leads</p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  )
}
