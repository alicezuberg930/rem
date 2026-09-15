import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TaskBoard } from './components/task-board'
import { TaskCalendar } from './components/task-calendar'
import { TaskGantt } from './components/task-gantt'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'

export function Tasks() {
  return (
    <TasksProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>

        <Tabs defaultValue='list' className='w-full flex-col'>
          <TabsList>
            <TabsTrigger value='list'>List</TabsTrigger>
            <TabsTrigger value='board'>Board</TabsTrigger>
            <TabsTrigger value='calendar'>Calendar</TabsTrigger>
            <TabsTrigger value='gantt'>Gantt</TabsTrigger>
          </TabsList>
          <TabsContent value='list'>
            <TasksTable />
          </TabsContent>
          <TabsContent value='board'>
            <TaskBoard />
          </TabsContent>
          <TabsContent value='calendar'>
            <TaskCalendar />
          </TabsContent>
          <TabsContent value='gantt'>
            <TaskGantt />
          </TabsContent>
        </Tabs>
      </Main>

      <TasksDialogs />
    </TasksProvider>
  )
}
