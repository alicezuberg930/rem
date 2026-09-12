import { Download, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

type Props = {
  isImporting: boolean
  importExcel: (event: React.ChangeEvent<HTMLInputElement>) => void
  exportExcel: () => void
}

export function ShipmentOrderPrimaryButtons({ isImporting, importExcel, exportExcel }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='flex gap-2'>
      <Button
        type='button'
        variant='outline'
        className='space-x-1'
        disabled={isImporting}
        onClick={() => fileInputRef.current?.click()}
      >
        <span>Import</span>
        {isImporting ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <Download size={18} />
        )}

        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={importExcel}
        />
      </Button>
      <Button
        type='button'
        variant='outline'
        className='space-x-1'
        onClick={exportExcel}
      >
        <span>Export</span>
        <Upload size={18} />
      </Button>
    </div>
  )
}
