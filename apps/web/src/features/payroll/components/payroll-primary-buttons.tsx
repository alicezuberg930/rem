import { type FormEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Play } from 'lucide-react'
import { toast } from 'sonner'
import { payroll } from '@/lib/queries/payroll'
import { HttpError } from '@/lib/repository/http-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ExportExcelButton } from '@/components/export-excel-button'

export function PayrollPrimaryButtons() {
  const [open, setOpen] = useState(false)
  const [periodId, setPeriodId] = useState('')
  const generatePayroll = useMutation(
    payroll().generateAllEmployeePayroll.mutationOptions()
  )

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedPeriodId = periodId.trim()
    if (!trimmedPeriodId || generatePayroll.isPending) return

    const submit = async () => {
      const response = await generatePayroll.mutateAsync(trimmedPeriodId)
      setPeriodId('')
      setOpen(false)
      return response.message
    }

    toast.promise(submit, {
      loading: 'Generating payroll',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: (message) => message,
    })
  }

  return (
    <div className='flex gap-2'>
      <ExportExcelButton
        filename='payroll.xlsx'
        download={() => payroll().export.download()}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button className='space-x-1'>
              <span>Generate payroll</span>
              <Play size={18} />
            </Button>
          }
        />
        <PopoverContent align='end' className='w-80'>
          <PopoverHeader>
            <PopoverTitle>Generate payroll</PopoverTitle>
            <PopoverDescription>
              Enter the payroll period ID to generate payroll for all employees.
            </PopoverDescription>
          </PopoverHeader>
          <form className='space-y-3' onSubmit={handleGenerate}>
            <div className='space-y-2'>
              <Label htmlFor='payroll-period-id'>Payroll period ID</Label>
              <Input
                id='payroll-period-id'
                value={periodId}
                onChange={(event) => setPeriodId(event.target.value)}
                placeholder='payroll_period_id'
                disabled={generatePayroll.isPending}
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={!periodId.trim() || generatePayroll.isPending}
            >
              {generatePayroll.isPending && (
                <Loader2 className='size-4 animate-spin' />
              )}
              Generate
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  )
}
