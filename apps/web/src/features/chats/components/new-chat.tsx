import { useState } from 'react'
import { X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { type ChatUser } from '@/@types'
import { getInitials } from '@/lib/utils'

type NewChatProps = {
  users: ChatUser[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectUser: (user: ChatUser) => void
}

export function NewChat({
  users,
  onOpenChange,
  onSelectUser,
  open,
}: NewChatProps) {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) setSelectedUser(null)
  }

  const handleStartChat = () => {
    if (!selectedUser) return
    onSelectUser(selectedUser)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-sm'>To:</span>
            {selectedUser && (
              <Badge variant='default'>
                {selectedUser.fullname}
                <button
                  type='button'
                  className='outline-hidden'
                  onClick={() => setSelectedUser(null)}
                >
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}
          </div>
          <Command className='rounded-lg border'>
            <CommandInput
              placeholder='Search people...'
              className='text-foreground'
            />
            <CommandList className='mt-1'>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    onSelect={() =>
                      setSelectedUser((current) =>
                        current?.id === user.id ? null : user
                      )
                    }
                    key={user.id}
                    value={`${user.fullname} ${user.email}`}
                    data-checked={selectedUser?.id === user.id}
                    aria-selected={selectedUser?.id === user.id}
                    className='bg-transparent data-[checked=false]:bg-transparent'
                  >
                    <Avatar className='size-8'>
                      <AvatarImage
                        src={user.avatar ?? undefined}
                        alt={user.fullname}
                      />
                      <AvatarFallback>
                        {getInitials(user.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0 flex-1'>
                      <span className='block truncate font-medium'>
                        {user.fullname}
                      </span>
                      <span className='block truncate text-xs text-muted-foreground'>
                        {user.email}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <Button
            type='button'
            variant='default'
            onClick={handleStartChat}
            disabled={!selectedUser}
          >
            Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
