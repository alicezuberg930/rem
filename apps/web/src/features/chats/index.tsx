import { Fragment, SubmitEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { useChat, type ChatSocketStatus } from '@/context/chat-provider'
import { ArrowLeft, Edit, ImagePlus, MessagesSquare, MoreVertical, Paperclip, Phone, Plus, Search, Send, Video } from 'lucide-react'
import { toast } from 'sonner'
import { chatQueries } from '@/lib/queries/chat'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/components/layout/clock-in-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search as SearchBox } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NewChat } from './components/new-chat'
import { type ChatMessage, type ChatUser } from '@/@types'

type MessageGroup = {
  date: string
  messages: ChatMessage[]
}

const socketStatusLabel: Record<ChatSocketStatus, string> = {
  connected: 'Connected',
  connecting: 'Connecting…',
  disconnected: 'Disconnected',
}

const getInitials = (name: string) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase()

const groupMessages = (messages: ChatMessage[]): MessageGroup[] => {
  const groups = new Map<string, ChatMessage[]>()
  const sortedMessages = [...messages].sort((left, right) => left.createdAt.localeCompare(right.createdAt))

  for (const message of sortedMessages) {
    const date = format(new Date(message.createdAt), 'd MMM, yyyy')
    const group = groups.get(date)
    if (group) group.push(message)
    else groups.set(date, [message])
  }

  return Array.from(groups, ([date, groupedMessages]) => ({
    date,
    messages: groupedMessages,
  }))
}

export function Chats() {
  const { user } = useAuth()
  const { businessId, status: socketStatus, sendMessage } = useChat()
  const currentUserId = user?.id
  const chatEnabled = Boolean(currentUserId && businessId)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [mobileSelectedUser, setMobileSelectedUser] = useState<ChatUser | null>(null)
  const [createConversationDialogOpened, setCreateConversationDialog] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)

  const {
    data: users = [],
    isPending: usersPending,
    isError: usersError,
  } = useQuery({
    ...chatQueries.users(currentUserId, businessId),
    enabled: chatEnabled,
  })

  const {
    data: messages = [],
    isPending: messagesPending,
    isError: messagesError,
  } = useQuery({
    ...chatQueries.messages(selectedUser?.id ?? '', currentUserId, businessId),
    enabled: chatEnabled && Boolean(selectedUser),
  })

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return users
    return users.filter(({ fullname, email }) => fullname.toLowerCase().includes(query) || email.toLowerCase().includes(query))
  }, [search, users])

  const messageGroups = useMemo(() => groupMessages(messages), [messages])

  useEffect(() => {
    const container = messagesRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight })
  }, [messages.length, selectedUser?.id])

  const handleSelectUser = useCallback((chatUser: ChatUser) => {
    setSelectedUser(chatUser)
    setMobileSelectedUser(chatUser)
    setDraft('')
  }, [])

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = draft.trim()
    if (!selectedUser || !content) return
    const sent = sendMessage({ recipientId: selectedUser.id, content })
    if (!sent) {
      toast.error('Chat is reconnecting')
      return
    }
    setDraft('')
  }

  const canSend = socketStatus === 'connected' && draft.trim().length > 0

  return (
    <>
      <Header>
        <SearchBox />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <section className='flex h-full gap-6'>
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Inbox</h1>
                  <MessagesSquare size={20} />
                </div>

                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => setCreateConversationDialog(true)}
                  className='rounded-lg'
                  aria-label='Start a new chat'
                >
                  <Edit size={24} className='stroke-muted-foreground' />
                </Button>
              </div>

              <label
                className={cn(
                  'focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden',
                  'flex h-10 w-full items-center space-x-0 rounded-md border border-border ps-2'
                )}
              >
                <Search size={15} className='me-2 stroke-slate-500' />
                <span className='sr-only'>Search</span>
                <input
                  type='search'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden'
                  placeholder='Search chat...'
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>

            <ScrollArea className='-mx-3 h-full overflow-scroll p-3'>
              {usersPending && (
                <p className='px-2 py-4 text-sm text-muted-foreground'>
                  Loading people…
                </p>
              )}
              {usersError && (
                <p className='px-2 py-4 text-sm text-destructive'>
                  Unable to load people.
                </p>
              )}
              {!usersPending && !usersError && filteredUsers.length === 0 && (
                <p className='px-2 py-4 text-sm text-muted-foreground'>
                  No people found.
                </p>
              )}
              {filteredUsers.map((chatUser) => (
                <Fragment key={chatUser.id}>
                  <button
                    type='button'
                    className={cn(
                      'group flex w-full rounded-md px-2 py-2 text-start text-sm hover:bg-accent hover:text-accent-foreground',
                      selectedUser?.id === chatUser.id && 'sm:bg-muted'
                    )}
                    onClick={() => handleSelectUser(chatUser)}
                  >
                    <div className='flex min-w-0 gap-2'>
                      <Avatar>
                        <AvatarImage
                          src={chatUser.avatar ?? undefined}
                          alt={chatUser.fullname}
                        />
                        <AvatarFallback>
                          {getInitials(chatUser.fullname)}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0'>
                        <span className='block truncate font-medium'>
                          {chatUser.fullname}
                        </span>
                        <span className='block truncate text-muted-foreground group-hover:text-accent-foreground/90'>
                          {chatUser.email}
                        </span>
                      </div>
                    </div>
                  </button>
                  <Separator className='my-1' />
                </Fragment>
              ))}
            </ScrollArea>
          </div>

          {selectedUser ? (
            <div
              className={cn(
                'absolute inset-0 inset-s-full z-50 hidden w-full flex-1 flex-col border bg-background shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md',
                mobileSelectedUser && 'inset-s-0 flex'
              )}
            >
              <div className='mb-1 flex flex-none justify-between bg-card p-4 shadow-lg sm:rounded-t-md'>
                <div className='flex gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='-ms-2 h-full sm:hidden'
                    onClick={() => setMobileSelectedUser(null)}
                    aria-label='Back to conversations'
                  >
                    <ArrowLeft className='rtl:rotate-180' />
                  </Button>
                  <div className='flex items-center gap-2 lg:gap-4'>
                    <Avatar className='size-9 lg:size-11'>
                      <AvatarImage
                        src={selectedUser.avatar ?? undefined}
                        alt={selectedUser.fullname}
                      />
                      <AvatarFallback>
                        {getInitials(selectedUser.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <span className='block truncate text-sm font-medium lg:text-base'>
                        {selectedUser.fullname}
                      </span>
                      <span className='block max-w-48 truncate text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                        {selectedUser.email} · {socketStatusLabel[socketStatus]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='-me-1 flex items-center gap-1 lg:gap-2'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                    aria-label='Start video call'
                  >
                    <Video size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                    aria-label='Start phone call'
                  >
                    <Phone size={22} className='stroke-muted-foreground' />
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                    aria-label='Conversation options'
                  >
                    <MoreVertical className='stroke-muted-foreground sm:size-5' />
                  </Button>
                </div>
              </div>

              <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pt-0 pb-4'>
                <div className='flex size-full flex-1'>
                  <div className='relative -me-4 flex flex-1 flex-col overflow-y-hidden'>
                    <div
                      ref={messagesRef}
                      className='flex h-40 w-full grow flex-col overflow-y-auto py-2 pe-4 pb-4'
                    >
                      <div className='mt-auto flex shrink-0 flex-col gap-4'>
                        {messagesPending && (
                          <p className='text-center text-sm text-muted-foreground'>
                            Loading messages…
                          </p>
                        )}
                        {messagesError && (
                          <p className='text-center text-sm text-destructive'>
                            Unable to load messages.
                          </p>
                        )}
                        {!messagesPending && !messagesError && messageGroups.length === 0 && (
                          <p className='text-center text-sm text-muted-foreground'>
                            No messages yet.
                          </p>
                        )}
                        {messageGroups.map((group) => (
                          <div key={group.date} className='flex flex-col gap-2'>
                            <div className='text-center text-xs'>
                              {group.date}
                            </div>
                            {group.messages.map((message) => {
                              const isOwnMessage =
                                message.senderId === currentUserId

                              return (
                                <div
                                  key={message.id}
                                  className={cn(
                                    'max-w-72 px-3 py-2 wrap-break-word shadow-lg',
                                    isOwnMessage
                                      ? 'self-end rounded-[16px_16px_0_16px] bg-primary/90 text-primary-foreground/75'
                                      : 'self-start rounded-[16px_16px_16px_0] bg-muted'
                                  )}
                                >
                                  {message.content}
                                  <span
                                    className={cn(
                                      'mt-1 block text-xs font-light text-foreground/75 italic',
                                      isOwnMessage &&
                                      'text-end text-primary-foreground/85'
                                    )}
                                  >
                                    {format(
                                      new Date(message.createdAt),
                                      'h:mm a'
                                    )}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <form
                  className='flex w-full flex-none gap-2'
                  onSubmit={handleSubmit}
                >
                  <div className='flex flex-1 items-center gap-2 rounded-md border border-input bg-card px-2 py-1 focus-within:ring-1 focus-within:ring-ring focus-within:outline-hidden lg:gap-4'>
                    <div className='space-x-1'>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        className='h-8 rounded-md'
                        aria-label='Add to message'
                      >
                        <Plus size={20} className='stroke-muted-foreground' />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        className='hidden h-8 rounded-md lg:inline-flex'
                        aria-label='Attach image'
                      >
                        <ImagePlus
                          size={20}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                      <Button
                        size='icon'
                        type='button'
                        variant='ghost'
                        className='hidden h-8 rounded-md lg:inline-flex'
                        aria-label='Attach file'
                      >
                        <Paperclip
                          size={20}
                          className='stroke-muted-foreground'
                        />
                      </Button>
                    </div>
                    <label className='flex-1'>
                      <span className='sr-only'>Chat Text Box</span>
                      <input
                        type='text'
                        value={draft}
                        maxLength={4000}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder='Type your message...'
                        className='h-8 w-full bg-inherit focus-visible:outline-hidden'
                      />
                    </label>
                    <Button
                      type='submit'
                      variant='ghost'
                      size='icon'
                      className='hidden sm:inline-flex'
                      disabled={!canSend}
                      aria-label='Send message'
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                  <Button
                    type='submit'
                    className='h-full sm:hidden'
                    disabled={!canSend}
                  >
                    <Send size={18} /> Send
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className='absolute inset-0 inset-s-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border bg-card shadow-xs sm:static sm:z-auto sm:flex'>
              <div className='flex flex-col items-center space-y-6'>
                <div className='flex size-16 items-center justify-center rounded-full border-2 border-border'>
                  <MessagesSquare className='size-8' />
                </div>
                <div className='space-y-2 text-center'>
                  <h1 className='text-xl font-semibold'>Your messages</h1>
                  <p className='text-sm text-muted-foreground'>
                    Send a message to start a chat.
                  </p>
                </div>
                <Button onClick={() => setCreateConversationDialog(true)}>
                  Send message
                </Button>
              </div>
            </div>
          )}
        </section>
        <NewChat
          users={users}
          onOpenChange={setCreateConversationDialog}
          onSelectUser={handleSelectUser}
          open={createConversationDialogOpened}
        />
      </Main>
    </>
  )
}
