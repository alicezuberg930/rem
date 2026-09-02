import { useState } from 'react'
import { Download, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import { exportContacts } from '@/lib/repository/api'
import { HttpError } from '@/lib/repository/http-error'
import { Button } from '@/components/ui/button'

const getFilename = (contentDisposition: string | null) => {
  const match = contentDisposition?.match(/filename="?([^";]+)"?/i)
  return match?.[1] ?? `customers-${new Date().toISOString().slice(0, 10)}.xlsx`
}

export function CustomersExportButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const { data, headers } = await exportContacts()
      const url = URL.createObjectURL(data)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = getFilename(headers.get('Content-Disposition'))
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 0)
      toast.success('Customer export downloaded')
    } catch (error) {
      toast.error(error instanceof HttpError ? error.message : 'Customer export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant='outline' onClick={handleExport} disabled={isExporting}>
      Export Excel
      {isExporting ? <LoaderCircle className='animate-spin' /> : <Download />}
    </Button>
  )
}
