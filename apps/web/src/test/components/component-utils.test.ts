import { describe, expect, it } from 'vitest'
import type { CalendarEvent } from '@/components/calendar-scheduler/types'
import {
  formatDateLabel,
  formatDayKey,
  getDateGridEventLayout,
  getMonthWeeks,
  getTimedEventLayout,
  getWeekDays,
} from '@/components/calendar-scheduler/utils'
import {
  fileData,
  fileFormat,
  fileNameByUrl,
  fileThumb,
  fileTypeByUrl,
} from '@/components/file-thumbnail/utils'

describe('file thumbnail utilities', () => {
  it('extracts normalized file information from signed URLs', () => {
    const url =
      'https://cdn.example.com/reports/Annual.PDF?signature=abc#page=1'

    expect(fileTypeByUrl(url)).toBe('pdf')
    expect(fileNameByUrl(url)).toBe('Annual.PDF')
    expect(fileFormat(url)).toBe('pdf')
    expect(fileThumb(url)).toBe('/assets/icons/files/ic_pdf.svg')
    expect(fileData(url)).toMatchObject({
      key: url,
      preview: url,
      name: 'Annual.PDF',
      type: 'pdf',
    })
  })

  it('uses the generic thumbnail for unknown extensions', () => {
    expect(fileThumb('/files/archive.custom')).toBe(
      '/assets/icons/files/ic_file.svg'
    )
  })
})

describe('calendar scheduler utilities', () => {
  const day = new Date(2026, 8, 30)

  it('creates Monday-first week and month grids', () => {
    const week = getWeekDays(day)
    const month = getMonthWeeks(day)

    expect(week).toHaveLength(7)
    expect(week[0].getDay()).toBe(1)
    expect(month.every((row) => row.length === 7)).toBe(true)
    expect(formatDayKey(day)).toBe('2026-09-30')
    expect(formatDateLabel(day)).toBe('30/09/2026')
  })

  it('places overlapping timed events in separate columns', () => {
    const events: CalendarEvent[] = [
      {
        id: 'one',
        title: 'One',
        start: new Date(2026, 8, 30, 9),
        end: new Date(2026, 8, 30, 10),
      },
      {
        id: 'two',
        title: 'Two',
        start: new Date(2026, 8, 30, 9, 30),
        end: new Date(2026, 8, 30, 11),
      },
    ]

    const layout = getTimedEventLayout(events, day)

    expect(layout.map(({ column }) => column)).toEqual([0, 1])
    expect(layout.every(({ columnCount }) => columnCount === 2)).toBe(true)
  })

  it('clips multi-day events to the visible date grid', () => {
    const days = getWeekDays(day)
    const event: CalendarEvent = {
      id: 'multi-day',
      title: 'Conference',
      start: new Date(2026, 8, 27),
      end: new Date(2026, 9, 7),
    }

    const [positioned] = getDateGridEventLayout([event], days)

    expect(positioned).toMatchObject({
      startColumn: 0,
      endColumn: 6,
      continuesBefore: true,
      continuesAfter: true,
    })
  })
})
