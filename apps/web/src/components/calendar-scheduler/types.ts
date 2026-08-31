export type View = 'day' | 'month' | 'week'

export type FileType = 'system' | 'share'

export const options = [
    { value: 'day', label: "Ngày" },
    { value: 'week', label: "Tuần" },
    { value: 'month', label: "Tháng" }
]