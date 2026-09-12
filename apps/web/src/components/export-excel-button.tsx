import { useState } from 'react'
import { Download } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import type { ResponseWithHeaders } from '@/lib/repository/http-client'
import { HttpError } from '@/lib/repository/http-error'
import { Button } from './ui/button'

type ExportExcelButtonProps = {
  download: () => Promise<ResponseWithHeaders<Blob>>
  filename: string
  label?: string
}

function getDownloadFilename(headers: Headers, fallback: string) {
  const disposition = headers.get('content-disposition')
  if (!disposition) return fallback

  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
  if (encoded) return decodeURIComponent(encoded)

  return disposition.match(/filename="?([^"]+)"?/i)?.[1]?.trim() ?? fallback
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function ExportExcelButton({
  download,
  filename,
  label = 'Export',
}: ExportExcelButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    const submit = async () => {
      setIsExporting(true)
      try {
        const response = await download()
        downloadBlob(
          response.data,
          getDownloadFilename(response.headers, filename)
        )
      } finally {
        setIsExporting(false)
      }
    }

    toast.promise(submit, {
      loading: 'Exporting Excel',
      error: (error) =>
        error instanceof HttpError ? error.message : 'Internal server error',
      success: 'Excel export downloaded',
    })
  }

  return (
    <Button
      variant='outline'
      className='space-x-1'
      onClick={handleExport}
      disabled={isExporting}
    >
      <span>{label}</span>
      <Download size={18} />
    </Button>
  )
}
