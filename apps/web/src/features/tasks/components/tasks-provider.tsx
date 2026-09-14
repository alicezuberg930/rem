import React, { useState } from 'react'
import type { TaskBoardItem } from '@/@types'
import useDialogState from '@/hooks/use-dialog-state'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import' | 'detail'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: TaskBoardItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TaskBoardItem | null>>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TaskBoardItem | null>(null)

  return (
    <TasksContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
