export type View = 'day' | 'month' | 'week'

export type FileType = 'system' | 'share'

export type CalendarContextType = {
    reloadKey: Record<View, number>
    triggerReload: (view: View) => void
}

export type DatePickerValue = Date | {
    from: Date;
    to: Date;
}

export type CalendarEvent = {
    originalStartTime: string
    originalEndTime: string
    dayFrom: string
    dayTo: string
    fromTime: string
    toTime: string
    time: string
    isMultiDay: boolean
    id: string
    title: string
    description: string
    group: number
    color: string
}

export const options: Record<View, string> = {
    day: "Ngày",
    week: "Tuần",
    month: "Tháng"
}