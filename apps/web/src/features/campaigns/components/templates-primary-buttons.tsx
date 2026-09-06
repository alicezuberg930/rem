import { LayoutDashboard } from 'lucide-react'
import { campaigns } from '@/lib/queries/campaign'
import { Button } from '@/components/ui/button'
import { ExportExcelButton } from '@/components/export-excel-button'
import { useCampaigns } from './campaign-provider'

export function TemplatesPrimaryButtons() {
  const { setOpen } = useCampaigns()
  return (
    <div className='flex gap-2'>
      <ExportExcelButton
        filename='campaigns.xlsx'
        download={() => campaigns().export.download()}
      />
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add campaign</span>
        <LayoutDashboard size={18} />
      </Button>
    </div>
  )
}
