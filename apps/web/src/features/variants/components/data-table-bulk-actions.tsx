import { useState } from 'react'
import type { Table } from '@tanstack/react-table'
import type { Variant } from '@/@types/variant'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { VariantsMultiDeleteDialog } from './variants-multi-delete-dialog'

type DataTableBulkActionsProps = {
  table: Table<Variant>
}

export function DataTableBulkActions({ table }: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='variant'>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant='destructive'
                size='icon'
                className='size-8'
                aria-label='Delete selected variants'
                onClick={() => setShowDeleteConfirm(true)}
              />
            }
          >
            <Trash2 />
          </TooltipTrigger>
          <TooltipContent>Delete selected variants</TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <VariantsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
