import React, { useState } from 'react'
import { Attendance } from '@/@types'
import useDialogState from '@/hooks/use-dialog-state'

type AttendancesDialogType = 'preview' | 'add' | 'edit' | 'delete'

type AttendancesContextType = {
  open: AttendancesDialogType | null
  setOpen: (str: AttendancesDialogType | null) => void
  currentRow: Attendance | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Attendance | null>>
}

const AttendancesContext = React.createContext<AttendancesContextType | null>(null)

export function AttendancesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AttendancesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Attendance | null>(null)

  return (
    <AttendancesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </AttendancesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAttendances = () => {
  const attendancesContext = React.useContext(AttendancesContext)

  if (!attendancesContext) {
    throw new Error(
      'useAttendances hook has to be used within <AttendancesContext.Provider>'
    )
  }

  return attendancesContext
}
