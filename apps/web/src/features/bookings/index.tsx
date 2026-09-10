import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import {
  CALENDAR_BOOKING_STATUS,
  CALENDAR_BOOKING_STATUS_COLOR,
  type CalendarBooking,
  type CalendarBookingStatus,
} from '@/@types'
import { bookings } from '@/lib/queries/booking'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CalendarScheduler,
  type CalendarEvent,
  type CalendarEventRenderProps,
} from '@/components/calendar-scheduler'
import { ConfigDrawer } from '@/components/config-drawer'
import { ClockInButton } from '@/components/layout/clock-in-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BookingsDialogs } from './components/bookings-dialogs'
import { BookingsPrimaryButtons } from './components/bookings-primary-buttons'
import { BookingsProvider } from './components/bookings-provider'

type BookingCalendarEvent = CalendarEvent<CalendarBooking>

const mapToEvents = (items: CalendarBooking[]): BookingCalendarEvent[] => {
  return items.map((booking) => ({
    id: booking.id,
    title: getContactName(booking),
    start: booking.bookingStartDate,
    end: booking.bookingEndDate,
    color: CALENDAR_BOOKING_STATUS_COLOR[booking.status],
    data: booking,
  }))
}

export function Bookings() {
  const { data: bookingResponses = [] } = useQuery(bookings().all.queryOptions())
  const calendarEvents = mapToEvents(bookingResponses)

  return (
    <BookingsProvider>
      <Header fixed>
        <Search />
        <ClockInButton />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-row gap-4 sm:gap-6'>
        <div className='flex-none space-y-6'>
          <BookingsPrimaryButtons />
          <div className='flex flex-col gap-2'>
            {Object.entries(CALENDAR_BOOKING_STATUS_COLOR).map(
              ([status, color]) => (
                <Button style={{ backgroundColor: color }} key={status}>
                  {CALENDAR_BOOKING_STATUS[status as CalendarBookingStatus]}
                </Button>
              )
            )}
          </div>
        </div>
        <div className='min-w-0 flex-1'>
          <CalendarScheduler
            events={calendarEvents}
            initialView='month'
            emptyMessage='No bookings scheduled.'
            renderEventTooltip={BookingEventTooltip}
            renderEventDialog={BookingEventDialog}
          />
        </div>
      </Main>

      <BookingsDialogs />
    </BookingsProvider>
  )
}

function BookingEventTooltip({
  event,
  startsAt,
  endsAt,
}: CalendarEventRenderProps<BookingCalendarEvent>) {
  const booking = event.data

  return (
    <div className='space-y-1.5'>
      <div className='flex items-center gap-2'>
        <span
          className='size-2 rounded-full'
          style={{ backgroundColor: event.color }}
        />
        <p className='font-medium'>{event.title}</p>
      </div>
      <p className='text-muted-foreground'>
        {format(startsAt, 'dd/MM/yyyy HH:mm')} - {format(endsAt, 'HH:mm')}
      </p>
      {booking?.contact.phone && (
        <p className='text-muted-foreground'>{booking.contact.phone}</p>
      )}
    </div>
  )
}

function BookingEventDialog({
  event,
  startsAt,
  endsAt,
}: CalendarEventRenderProps<BookingCalendarEvent>) {
  const booking = event.data
  const status = booking?.status ?? 'BOOKED'

  return (
    <div className='space-y-5'>
      <div className='space-y-2'>
        <div>
          <h2 className='font-heading text-lg leading-none font-medium'>
            {event.title}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {format(startsAt, 'dd/MM/yyyy HH:mm')} -{' '}
            {format(endsAt, 'dd/MM/yyyy HH:mm')}
          </p>
        </div>
      </div>

      {booking && (
        <div className='grid gap-3 text-sm'>
          <DetailRow label='Phone' value={booking.contact.phone} />
          <DetailRow label='Email' value={booking.contact.email} />
          <DetailRow
            label='Service staff'
            value={booking.serviceStaff?.fullname ?? 'Unassigned'}
          />
          <DetailRow
            label='Correspondent'
            value={booking.correspondent?.fullname ?? 'Unassigned'}
          />
          {booking.cancelReason && (
            <DetailRow label='Cancel reason' value={booking.cancelReason} />
          )}
          <div className='grid grid-cols-[7rem_1fr] gap-3'>
            <span className='text-muted-foreground'>Status</span>
            <span className='min-w-0 truncate font-medium'>
              <Badge style={{ backgroundColor: CALENDAR_BOOKING_STATUS_COLOR[status] }}>
                {CALENDAR_BOOKING_STATUS[status]}
              </Badge>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className='grid grid-cols-[7rem_1fr] gap-3'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='min-w-0 truncate font-medium'>{value || '-'}</span>
    </div>
  )
}

function getContactName(booking: CalendarBooking) {
  return [
    booking.contact.surname,
    booking.contact.lastName,
    booking.contact.firstName,
  ]
    .filter(Boolean)
    .join(' ')
}
