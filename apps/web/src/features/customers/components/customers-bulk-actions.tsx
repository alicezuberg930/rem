import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { CustomersMultiDeleteDialog } from './customers-multi-delete-dialog'

type CustomersBulkActionsProps<TData> = {
  table: Table<TData>
}

export function CustomersBulkActions<TData>({
  table,
}: CustomersBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='customer'>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected customers'
              title='Delete selected customers'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected customers</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected customers</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
      <CustomersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
