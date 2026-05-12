import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Campaign, Contact, Template } from '@/@types'
import { templates as t } from '@/lib/queries/template'
import { getContacts } from '@/lib/repository/api'
import useDialogState from '@/hooks/use-dialog-state'

type CampaignsDialogType = 'preview' | 'add' | 'edit' | 'delete'

type CampaignsContextType = {
  open: CampaignsDialogType | null
  setOpen: (str: CampaignsDialogType | null) => void
  currentRow: Campaign | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Campaign | null>>
  templates: Template[]
  contacts: Contact[]
}

const CampaignsContext = React.createContext<CampaignsContextType | null>(null)

export function CampaignsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CampaignsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Campaign | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const { data } = useQuery(t().all.queryOptions())
  const templates = data?.content || []

  useEffect(() => {
    getContacts().then((res) => setContacts(res.data.content))
  }, [])

  return (
    <CampaignsContext
      value={{ open, setOpen, currentRow, setCurrentRow, templates, contacts }}
    >
      {children}
    </CampaignsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCampaigns = () => {
  const campaignsContext = React.useContext(CampaignsContext)

  if (!campaignsContext) {
    throw new Error(
      'useCampaigns hook has to be used within <CampaignsContext>'
    )
  }

  return campaignsContext
}
