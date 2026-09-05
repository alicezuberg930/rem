import { useState } from 'react'
import { Check, X } from 'lucide-react'
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
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-baseline-last gap-2'>
            <span className='min-h-6 text-sm text-muted-foreground'>To:</span>
            {selectedUser && (
              <Badge variant='default'>
                {selectedUser.fullname}
                <button
                  type='button'
                  className='ms-1 rounded-full ring-offset-background outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  onClick={() => setSelectedUser(null)}
                >
                  <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                </button>
              </Badge>
            )}
          </div>
          <Command className='rounded-lg border'>
            <CommandInput
              placeholder='Search people...'
              className='text-foreground'
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={`${user.fullname} ${user.email}`}
                    onSelect={() =>
                      setSelectedUser((current) =>
                        current?.id === user.id ? null : user
                      )
                    }
                    className='flex items-center justify-between gap-2 hover:bg-accent hover:text-accent-foreground'
                  >
                    <div className='flex items-center gap-2'>
                      <Avatar className='size-8'>
                        <AvatarImage
                          src={user.avatar ?? undefined}
                          alt={user.fullname}
                        />
                        <AvatarFallback>
                          {getInitials(user.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>
                          {user.fullname}
                        </span>
                        <span className='text-xs text-accent-foreground/70'>
                          {user.email}
                        </span>
                      </div>
                    </div>

                    {selectedUser?.id === user.id && (
                      <Check className='h-4 w-4' />
                    )}
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
