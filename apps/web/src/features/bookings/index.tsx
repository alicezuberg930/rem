'use client'
import '@schedule-x/theme-default/dist/index.css'
import 'temporal-polyfill/global'
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react'
import {
    createViewDay,
    createViewWeekAgenda,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
    createViewList,
    CalendarEventExternal,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useEffect, useState } from "react";
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { Header, Main } from '@/layout'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
    CALENDAR_BOOKING_STATUS,
    CALENDAR_BOOKING_STATUS_COLOR,
    CalendarBooking,
    CalendarBookingStatus
} from '@/@types'
import { BookingsProvider } from './components/bookings-provider'
import { BookingsDialogs } from './components/bookings-dialogs'
import { BookingsPrimaryButtons } from './components/bookings-primary-buttons'
import { getBookings } from '@/lib/repository/api'

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function Bookings() {
    const eventsService = useState(() => createEventsServicePlugin())[0]
    const eventModal = useState(() => createEventModalPlugin())[0]
    const { theme } = useTheme()

    const calendar = useCalendarApp({
        defaultView: "month-grid",
        timezone,
        views: [createViewMonthGrid(), createViewDay(), createViewMonthAgenda(), createViewList(), createViewWeekAgenda(), createViewWeek()],
        // events: [
        //     {
        //         id: '8',
        //         title: 'Event 8',
        //         start: Temporal.PlainDate.from('2026-04-25'),
        //         end: Temporal.PlainDate.from('2026-04-27'),
        //         description: "qeuigfuihqfioqfqi",
        //         location: "483 Ohio Avn",
        //         people: ["AAA", "BBB", "ccc"],
        //         _customContent: {
        //             type: "MEETING",
        //         }
        //     },
        // ],
        plugins: [eventsService, eventModal],
        callbacks: {
            onRender: () => {
                eventsService.getAll()
            }
        },
        
    })

    const mapToEvents = (bookings: CalendarBooking[]): CalendarEventExternal[] => {
        return bookings.map(b => ({
            id: String(b.id),
            title: b.contact.firstName,
            start: Temporal.Instant.from(b.bookingStartDate).toZonedDateTimeISO(timezone),
            end: Temporal.Instant.from(b.bookingEndDate).toZonedDateTimeISO(timezone),
            
        }))
    }

    useEffect(() => {
        getBookings().then(res => {
            const events = mapToEvents(res.data)
            eventsService.set(events)
        })
    }, [])

    useEffect(() => {
        calendar?.setTheme(theme as 'light' | 'dark')
    }, [theme])

    return (
        <BookingsProvider>
            <Header fixed>
                <Search />
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
                        {Object.entries(CALENDAR_BOOKING_STATUS_COLOR).map(i => (
                            <Button style={{ backgroundColor: i[1] }} key={i[0]}>
                                {CALENDAR_BOOKING_STATUS[i[0] as CalendarBookingStatus]}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className='flex-1'>
                    <ScheduleXCalendar calendarApp={calendar} />
                </div>
            </Main>

            <BookingsDialogs />
        </BookingsProvider>
    )
}