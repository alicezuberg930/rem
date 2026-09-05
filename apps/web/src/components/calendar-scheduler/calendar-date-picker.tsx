// import { useState, useMemo, useRef, useEffect } from "react"
// import { Calendar, ChevronDown, X } from "lucide-react"
// import { DatePickerValue, View } from "./types"

// const getWeeksOfMonth = (year: number, month: number, weekStart: "monday" | "sunday" = "monday") => {
//     const weeks = []
//     const firstDay = new Date(year, month - 1, 1)
//     const lastDay = new Date(year, month, 0)
//     let start = new Date(firstDay)
//     while ((weekStart === "monday" && start.getDay() !== 1) || (weekStart === "sunday" && start.getDay() !== 0)) {
//         start.setDate(start.getDate() - 1)
//     }
//     let end = new Date(start)
//     end.setDate(end.getDate() + 6)
//     while (start <= lastDay) {
//         weeks.push({ from: new Date(start), to: new Date(end) })
//         start.setDate(start.getDate() + 7)
//         end.setDate(end.getDate() + 7)
//     }
//     return weeks
// }

// const pad = (num: unknown) => {
//     if (typeof num !== "number" || isNaN(num)) return "--"
//     return num.toString().padStart(2, "0")
// }

// type CalendarDatePickerProps = {
//     mode?: View
//     value?: DatePickerValue
//     onChange?: (value: DatePickerValue) => void
//     minYear?: number
//     maxYear?: number
//     weekStart?: "monday" | "sunday"
// }

// export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
//     mode = "month",
//     value,
//     onChange,
//     minYear = 2020,
//     maxYear = 2030,
//     weekStart = "monday",
// }) => {
//     const today = new Date()
//     const selectedWeekRef = useRef<HTMLButtonElement>(null)

//     const defaultValue = useMemo<DatePickerValue>(() => {
//         if (mode === "week") {
//             const startOfWeek = new Date(today)
//             const startDay = weekStart === "monday" ? 1 : 0
//             while (startOfWeek.getDay() !== startDay) {
//                 startOfWeek.setDate(startOfWeek.getDate() - 1)
//             }
//             startOfWeek.setHours(0, 0, 0, 0)
//             const endOfWeek = new Date(startOfWeek)
//             endOfWeek.setDate(startOfWeek.getDate() + 6)
//             endOfWeek.setHours(23, 59, 59, 999)
//             return { from: startOfWeek, to: endOfWeek }
//         }
//         if (mode === "month") {
//             return new Date(today.getFullYear(), today.getMonth(), 1)
//         }
//         return today
//     }, [mode, weekStart])

//     const [internalValue, setInternalValue] = useState<DatePickerValue>(defaultValue)

//     useEffect(() => {
//         const isValidWeek = mode === "week" && value && typeof value === "object" && value.from instanceof Date && value.to instanceof Date
//         const isValidDate = (mode === "day" || mode === "month") && value instanceof Date
//         if (isValidWeek || isValidDate) {
//             setInternalValue(value)
//         } else {
//             setInternalValue(defaultValue)
//         }
//     }, [value, defaultValue, mode])

//     const [open, setOpen] = useState(false)

//     const [year, setYear] = useState(() => {
//         if (mode === "week" && defaultValue && 'from' in defaultValue && defaultValue.from instanceof Date)
//             return defaultValue.from.getFullYear()
//         if (defaultValue && defaultValue instanceof Date)
//             return defaultValue.getFullYear()
//         return today.getFullYear()
//     })

//     const [month, setMonth] = useState(() => {
//         if (mode === "week" && defaultValue && 'from' in defaultValue && defaultValue.from instanceof Date)
//             return defaultValue.from.getMonth() + 1
//         if (defaultValue && defaultValue instanceof Date)
//             return defaultValue.getMonth() + 1
//         return today.getMonth() + 1
//     })

//     const years = useMemo(() => Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i), [minYear, maxYear])
//     const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])

//     // Sau các useState year, month
//     useEffect(() => {
//         if (mode === "week" && value && 'from' in value && value.from instanceof Date) {
//             setYear(value.from.getFullYear())
//             setMonth(value.from.getMonth() + 1)
//         }
//     }, [mode, value])

//     const [showYearDropdown, setShowYearDropdown] = useState(false)
//     const [showMonthDropdown, setShowMonthDropdown] = useState(false)
//     const containerRef = useRef<HTMLDivElement>(null)

//     useEffect(() => {
//         if (!open && !showYearDropdown && !showMonthDropdown) return;

//         const handleClickOutside = (e) => {
//             if (containerRef.current && !containerRef.current.contains(e.target)) {
//                 setShowYearDropdown(false)
//                 setShowMonthDropdown(false)
//                 setOpen(false)
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [open, showYearDropdown, showMonthDropdown]);

//     useEffect(() => {
//         if (open && selectedWeekRef.current) {
//             selectedWeekRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
//         }
//     }, [open])

//     const weeks = useMemo(() => getWeeksOfMonth(year, month, weekStart), [year, month, weekStart])

//     const buttonClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-left"
//     const dropdownClasses = "absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl box-border min-w-[320px]"

//     const optionBtn = (active, center = false) =>
//         `${center ? "text-center w-full justify-center flex items-center" : "text-left px-2"} h-8 text-sm rounded-md ${active ? "bg-blue-500 text-white font-semibold rounded-full" : "hover:bg-[#F0F5FF] text-gray-900"}`

//     const handleClear = (e) => {
//         e.stopPropagation()
//         setOpen(false)
//         if (mode === "week") {
//             const startOfWeek = new Date(today)
//             const startDay = weekStart === "monday" ? 1 : 0
//             while (startOfWeek.getDay() !== startDay) {
//                 startOfWeek.setDate(startOfWeek.getDate() - 1)
//             }
//             const endOfWeek = new Date(startOfWeek)
//             endOfWeek.setDate(startOfWeek.getDate() + 6)
//             const currentWeek = { from: startOfWeek, to: endOfWeek }
//             setInternalValue(currentWeek)
//         } else {
//             setInternalValue(null)
//         }
//     }

//     const renderInput = (label) => (
//         <div className="relative">
//             <button
//                 type="button"
//                 className={buttonClasses + " truncate max-w-full overflow-hidden text-ellipsis pr-10"} // thêm class fix dài
//                 onClick={() => setOpen((v) => !v)}
//                 style={{ minHeight: 40, width: '100%' }}
//             >
//                 <span className="truncate max-w-[85%] block">{label || "Chọn"}</span>
//             </button>
//             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                 {internalValue && (
//                     <button
//                         type="button"
//                         className="text-gray-400 hover:text-gray-500 mr-1 pointer-events-auto"
//                         onClick={handleClear}
//                         tabIndex={-1}
//                     >
//                         <X className="w-4 h-4" />
//                     </button>
//                 )}
//                 <Calendar className="w-4 h-4 text-gray-400 ml-1 pointer-events-none" />
//             </div>
//         </div>
//     )


//     const renderYearMonthSelects = () => (
//         <div className="flex justify-center items-center px-4 pt-3 gap-6 text-sm" ref={containerRef}>
//             {mode !== "month" && (
//                 <div className="w-[110px]">
//                     <div className="flex items-center gap-2">
//                         <span className="text-gray-700 text-xs font-medium">Tháng</span>
//                         <div className="relative w-full">
//                             <button
//                                 onClick={() => {
//                                     setShowMonthDropdown(!showMonthDropdown)
//                                     setShowYearDropdown(false)
//                                 }}
//                                 className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center text-gray-900 shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//                             >
//                                 {month}
//                                 <ChevronDown className="w-4 h-4 text-gray-500" />
//                             </button>
//                             {showMonthDropdown && (
//                                 <ul className="absolute z-[9999] mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
//                                     {months.map((m) => (
//                                         <li
//                                             key={m}
//                                             onClick={() => {
//                                                 setMonth(m)
//                                                 setShowMonthDropdown(false)
//                                             }}
//                                             className={`px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 ${m === month ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-800"
//                                                 }`}
//                                         > {m}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}
//             <div className="w-[140px]">
//                 <div className="flex items-center gap-2">
//                     <span className="text-gray-700 text-xs font-medium">Năm</span>
//                     <div className="relative w-full">
//                         <button
//                             onClick={() => {
//                                 setShowYearDropdown(!showYearDropdown)
//                                 setShowMonthDropdown(false)
//                             }}
//                             className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 flex justify-between items-center text-gray-900 shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
//                         >
//                             {year}
//                             <ChevronDown className="w-4 h-4 text-gray-500" />
//                         </button>
//                         {showYearDropdown && (
//                             <ul className="absolute z-[9999] mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
//                                 {years.map((y) => (
//                                     <li
//                                         key={y}
//                                         onClick={() => {
//                                             setYear(y)
//                                             setShowYearDropdown(false)
//                                         }}
//                                         className={`px-4 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 ${y === year ? "bg-blue-100 text-blue-500 font-semibold" : "text-gray-800"
//                                             }`}
//                                     >
//                                         {y}
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )

//     const renderModeContent = () => {
//         if (mode === "month") {
//             return (
//                 <div className="grid grid-cols-4 gap-2 px-5 py-3">
//                     {months.map((m) => (
//                         <button
//                             key={m}
//                             className={`${optionBtn((internalValue?.getMonth?.() + 1 || month) === m, true)} !w-9 !h-9`}
//                             onClick={() => {
//                                 const newDate = new Date(year, m - 1, 1)
//                                 onChange?.(newDate)
//                                 setInternalValue(newDate)
//                                 setMonth(m)
//                                 setOpen(false)
//                             }}
//                         >
//                             T{m}
//                         </button>
//                     ))}
//                 </div>
//             )
//         }

//         if (mode === "week") {
//             return (
//                 <div className="flex flex-col px-3 pb-3 gap-1">
//                     {weeks.map((w, idx) => {
//                         const isSelected =
//                             internalValue?.from instanceof Date &&
//                             w.from instanceof Date &&
//                             internalValue.from.getTime() === w.from.getTime()

//                         return (
//                             <button
//                                 key={idx}
//                                 ref={isSelected ? selectedWeekRef : null}
//                                 className={`${optionBtn(isSelected)} text-left`}
//                                 onClick={() => {
//                                     const from = new Date(w.from)
//                                     from.setHours(0, 0, 0, 0)
//                                     const to = new Date(w.to)
//                                     to.setHours(23, 59, 59, 999)
//                                     const fixedWeek = { from, to }
//                                     onChange?.(fixedWeek)
//                                     setInternalValue(fixedWeek)
//                                     setOpen(false)
//                                 }}
//                             >
//                                 <span className="text-sm font-medium">Tuần {idx + 1}</span>
//                                 <span className="ml-2 text-sm ">
//                                     {pad(w.from.getDate())}/{pad(w.from.getMonth() + 1)} - {pad(w.to.getDate())}/{pad(w.to.getMonth() + 1)}/{w.to.getFullYear()}
//                                 </span>
//                             </button>
//                         )
//                     })}
//                 </div>
//             )
//         }

//         // Day mode
//         const firstDayOfMonth = new Date(year, month - 1, 1)
//         const startOffset = (firstDayOfMonth.getDay() - 1 + 7) % 7
//         const startDate = new Date(firstDayOfMonth)
//         startDate.setDate(firstDayOfMonth.getDate() - startOffset)

//         const grid = []
//         for (let i = 0; i < 5; i++) {
//             const row = []
//             for (let j = 0; j < 7; j++) {
//                 const date = new Date(startDate)
//                 date.setDate(startDate.getDate() + i * 7 + j)
//                 row.push(date)
//             }
//             grid.push(row)
//         }

//         return (
//             <>
//                 <div className="grid grid-cols-7 text-center  text-[13px] font-semibold text-blue-600">
//                     {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
//                         <div key={d}>{d}</div>
//                     ))}
//                 </div>
//                 {grid.map((row, ridx) => (
//                     <div key={ridx} className="grid grid-cols-7 gap-y-1">
//                         {row.map((date, cidx) => {
//                             const isCurrentMonth = date.getMonth() + 1 === month
//                             const isSelected =
//                                 internalValue?.getDate?.() === date.getDate() &&
//                                 internalValue?.getMonth?.() === date.getMonth() &&
//                                 internalValue?.getFullYear?.() === date.getFullYear()

//                             return (
//                                 <button
//                                     key={cidx}
//                                     onClick={() => {
//                                         const newDate = new Date(date)
//                                         onChange?.(newDate)
//                                         setInternalValue(newDate)
//                                         setOpen(false)
//                                     }}
//                                     className={`w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors
//                 ${isSelected ? "bg-blue-500 text-white shadow-sm" : ""}
//                 ${!isCurrentMonth ? "text-gray-300" : " hover:bg-[#F0F5FF] hover:!text-gray-600"}`}
//                                 >
//                                     {date.getDate()}
//                                 </button>
//                             )
//                         })}
//                     </div>
//                 ))}
//             </>
//         )
//     }

//     return (
//         <div className="relative">
//             {renderInput(
//                 mode === "week"
//                     ? internalValue?.from && internalValue?.to
//                         ? `${pad(internalValue.from.getDate())}/${pad(internalValue.from.getMonth() + 1)} - ${pad(internalValue.to.getDate())}/${pad(internalValue.to.getMonth() + 1)}/${internalValue.to.getFullYear()}`
//                         : "Chọn tuần"
//                     : mode === "month"
//                         ? internalValue instanceof Date
//                             ? `Tháng ${pad(internalValue.getMonth() + 1)} - ${internalValue.getFullYear()}`
//                             : "Chọn tháng"
//                         : internalValue instanceof Date
//                             ? `${pad(internalValue.getDate())}/${pad(internalValue.getMonth() + 1)}/${internalValue.getFullYear()}`
//                             : "Chọn ngày"
//             )}

//             {open && (
//                 <div ref={containerRef} className={dropdownClasses}>
//                     {renderYearMonthSelects()}
//                     <div className="h-[1px] bg-gray-200 mx-5 my-2" />
//                     <div className="px-5 pb-3">
//                         {renderModeContent()}
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }
