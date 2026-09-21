import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type SubmitEvent } from 'react'
import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChatGroup, ChatMessage, ChatUser, ChatUserStatus } from '@/@types'
import { useAuth } from '@/providers/auth-provider'
import { ArrowLeft, Edit, ImagePlus, MessagesSquare, MoreVertical, Paperclip, Phone, Plus, Search, Send, UsersRound, Video } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { chatKeys, chatQueries } from '@/lib/queries/chat'
import { cn, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/layout/clock-in-button'
import { Header } from '@/layout/header'
import { Main } from '@/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search as SearchBox } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useChat } from '@/features/chats/components/chat-provider'
import { CreateGroupDialog } from './components/create-group-dialog'
import { NewChat } from './components/new-chat'
import { ChatListShimmer } from './components/chat-list-shimmer'

type MessageGroup = {
  date: string
  messages: ChatMessage[]
}

type ChatConversation = { type: 'direct', user: ChatUser } | { type: 'group', group: ChatGroup }

const socketStatusLabel: Record<ChatUserStatus, { label: string; className: string }> = {
  connected: { label: 'Connected', className: 'bg-green-500' },
  disconnected: { label: 'Disconnected', className: 'bg-red-500' },
}

export function Chats() {
  const navigate = useNavigate()
  const { role, user } = useAuth()
  const { businessId, status: socketStatus, sendMessage } = useChat()
  const queryClient = useQueryClient()
  const currentUserId = user?.id
  const chatEnabled = Boolean(currentUserId && businessId)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null)
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false)
  const [createConversationDialogOpened, setCreateConversationDialog] = useState(false)
  const [createGroupDialogOpened, setCreateGroupDialog] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const { data: users = [], isPending: usersPending, isError: usersError, } = useQuery({
    ...chatQueries.users(currentUserId, businessId),
    enabled: chatEnabled,
  })
  const { data: groups = [], isPending: groupsPending, isError: groupsError } = useQuery({
    ...chatQueries.groups(currentUserId, businessId),
    enabled: chatEnabled,
  })
  const conversationsPending = chatEnabled && (usersPending || groupsPending)
  const selectedConversationId = selectedConversation?.type === 'group' ? selectedConversation.group.id : (selectedConversation?.user.id ?? '')
  const messageQuery = selectedConversation?.type === 'group'
    ? chatQueries.groupMessages(selectedConversation.group.id, currentUserId, businessId)
    : chatQueries.messages(selectedConversation?.user.id ?? '', currentUserId, businessId)
  const {
    data: messages = [],
    isPending: messagesPending,
    isError: messagesError,
  } = useQuery({
    ...messageQuery,
    enabled: chatEnabled && Boolean(selectedConversation),
  })

  const filteredConversations = useMemo<ChatConversation[]>(() => {
    const query = search.trim().toLowerCase()
    const matchingGroups = groups.filter(({ name }) => name.toLowerCase().includes(query))
    const matchingUsers = users.filter(({ fullname, email }) =>
      fullname.toLowerCase().includes(query) || email.toLowerCase().includes(query)
    )

    return [
      ...matchingGroups.map((group) => ({ type: 'group' as const, group })),
      ...matchingUsers.map((chatUser) => ({ type: 'direct' as const, user: chatUser })),
    ]
  }, [groups, search, users])

  const messageGroups = useMemo<MessageGroup[]>(() => {
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
  }, [messages])

  useEffect(() => {
    const container = messagesRef.current
    if (!container) return
    container.scrollTo({ top: container.scrollHeight })
  }, [messages.length, selectedConversationId])

  const handleSelectConversation = useCallback((conversation: ChatConversation) => {
    setSelectedConversation(conversation)
    setMobileConversationOpen(true)
    setDraft('')
  }, [])

  const handleSelectUser = useCallback((chatUser: ChatUser) => handleSelectConversation({ type: 'direct', user: chatUser }), [handleSelectConversation])

  const handleGroupCreated = useCallback((group: ChatGroup) => {
    queryClient.setQueryData<ChatGroup[]>(
      chatKeys.groups(currentUserId, businessId),
      (currentGroups = []) => [
        group,
        ...currentGroups.filter(({ id }) => id !== group.id),
      ]
    )
    handleSelectConversation({ type: 'group', group })
  }, [businessId, currentUserId, handleSelectConversation, queryClient])

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = draft.trim()
    if (!selectedConversation || !content) return
    const sent = selectedConversation.type === 'group'
      ? sendMessage({ groupId: selectedConversation.group.id, content })
      : sendMessage({ recipientId: selectedConversation.user.id, content })
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
        <section className='flex h-full gap-2'>
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 bg-background pb-3 sm:static sm:z-auto sm:mx-0 sm:p-0'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Inbox</h1>
                </div>

                <div>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => setCreateConversationDialog(true)}
                    className='rounded-lg'
                    aria-label='Start a new chat'
                  >
                    <Edit size={24} className='stroke-muted-foreground' />
                  </Button>
                  {role?.name === 'OWNER' && (
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={() => setCreateGroupDialog(true)}
                      className='rounded-lg'
                      aria-label='Create group'
                    >
                      <UsersRound
                        size={24}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                  )}
                </div>
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

            <ScrollArea className='h-full overflow-scroll'>
              {!businessId && (
                <div className='px-2 py-4 text-sm text-muted-foreground'>
                  <p>Choose a business to view conversations.</p>
                  <Button
                    variant='outline'
                    className='mt-3'
                    onClick={() => navigate({ to: '/businesses' })}
                  >
                    Choose a business
                  </Button>
                </div>
              )}
              {conversationsPending && <ChatListShimmer />}
              {chatEnabled && !conversationsPending && (usersError || groupsError) && (
                <p className='px-2 py-4 text-sm text-destructive'>
                  Unable to load conversations.
                </p>
              )}
              {chatEnabled && !conversationsPending && !usersError && !groupsError && filteredConversations.length === 0 && (
                <p className='px-2 py-4 text-sm text-muted-foreground'>
                  No conversations found.
                </p>
              )}
              {filteredConversations.map((conversation) => {
                const isGroup = conversation.type === 'group'
                const conversationId = isGroup ? conversation.group.id : conversation.user.id
                const name = isGroup ? conversation.group.name : conversation.user.fullname
                const avatar = isGroup ? conversation.group.avatar : conversation.user.avatar
                const subtitle = isGroup ? `${conversation.group.members.length} members` : conversation.user.email
                const selected = selectedConversation?.type === conversation.type && selectedConversationId === conversationId
                return (
                  <Fragment key={`${conversation.type}:${conversationId}`}>
                    <button
                      type='button'
                      className={cn(
                        'group flex w-full rounded-md px-2 py-2 text-start text-sm hover:bg-accent hover:text-accent-foreground',
                        selected && 'sm:bg-muted'
                      )}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className='flex items-center min-w-0 gap-2'>
                        <Avatar>
                          <AvatarImage src={avatar ?? undefined} alt={name} />
                          <AvatarFallback>{getInitials(name)}</AvatarFallback>
                        </Avatar>
                        <div className='min-w-0'>
                          <span className='block truncate font-medium'>
                            {name}
                          </span>
                          <span className='block truncate text-muted-foreground group-hover:text-accent-foreground/90'>
                            {subtitle}
                          </span>
                        </div>
                      </div>
                    </button>
                    <Separator className='my-1' />
                  </Fragment>
                )
              })}
            </ScrollArea>
          </div>

          {selectedConversation ? (
            <div
              className={cn(
                'absolute inset-0 inset-s-full z-50 hidden w-full flex-1 flex-col border bg-background shadow-xs sm:static sm:z-auto sm:flex sm:rounded-md',
                mobileConversationOpen && 'inset-s-0 flex'
              )}
            >
              <div className='mb-1 flex flex-none justify-between bg-card p-4 shadow-lg sm:rounded-t-md'>
                <div className='flex gap-3'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='-ms-2 h-full sm:hidden'
                    onClick={() => setMobileConversationOpen(false)}
                    aria-label='Back to conversations'
                  >
                    <ArrowLeft className='rtl:rotate-180' />
                  </Button>
                  <div className='flex items-center gap-2 lg:gap-4'>
                    <Avatar className='size-9 lg:size-11 relative'>
                      <AvatarImage
                        src={(selectedConversation.type === 'group'
                          ? selectedConversation.group.avatar
                          : selectedConversation.user.avatar) ?? undefined
                        }
                        alt={selectedConversation.type === 'group'
                          ? selectedConversation.group.name
                          : selectedConversation.user.fullname
                        }
                      />
                      <AvatarFallback>
                        {getInitials(selectedConversation.type === 'group'
                          ? selectedConversation.group.name
                          : selectedConversation.user.fullname
                        )}
                      </AvatarFallback>
                      {selectedConversation.type === 'direct' && (
                        <span
                          className={cn(
                            'size-3 rounded-full absolute top-0 right-0 ',
                            socketStatusLabel[socketStatus].className
                          )}
                        />
                      )}
                    </Avatar>
                    <div className='min-w-0'>
                      <span className='block truncate text-sm font-medium lg:text-base'>
                        {selectedConversation.type === 'group'
                          ? selectedConversation.group.name
                          : selectedConversation.user.fullname}
                      </span>
                      <span className='flex max-w-48 min-w-0 items-center gap-1.5 text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                        <span className='truncate'>
                          {selectedConversation.type === 'group'
                            ? `${selectedConversation.group.members.length} members`
                            : selectedConversation.user.email}
                        </span>
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
                              const isOwnMessage = message.senderId === currentUserId
                              const senderName = selectedConversation.type === 'group'
                                ? selectedConversation.group.members.find(({ id }) => id === message.senderId)?.fullname
                                : undefined
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
                                  {senderName && !isOwnMessage && (
                                    <span className='mb-1 block text-xs font-medium text-foreground/70'>
                                      {senderName}
                                    </span>
                                  )}
                                  {message.content}
                                  <span
                                    className={cn(
                                      'mt-1 block text-xs font-light text-foreground/75 italic',
                                      isOwnMessage &&
                                      'text-end text-primary-foreground/85'
                                    )}
                                  >
                                    {format(new Date(message.createdAt), 'h:mm a')}
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
        {role?.name === 'OWNER' && (
          <CreateGroupDialog
            users={users}
            open={createGroupDialogOpened}
            onOpenChange={setCreateGroupDialog}
            onCreated={handleGroupCreated}
          />
        )}
      </Main>
    </>
  )
}
