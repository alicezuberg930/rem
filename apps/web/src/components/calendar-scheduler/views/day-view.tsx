// import { Clock9, MapPin } from "lucide-react"
// import { convertDateTimeToDate, getTopOffset, parseTimeToMinutes } from "../utils"
// import { useEffect, useState } from "react"
// import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter } from "@dnd-kit/core"
// import { useCalendar } from "../use-calendar"
// import { isAfter, isSameDay, parseISO } from "date-fns"
// import { useCalendar as useCalendarReload } from "../calendar-provider"
// import ConfirmModalChangeTime from "./confirmModalChangeTime"
// import ConfirmChangeTime from "../forms/confirm-change-time"
// import { useRedirect } from "@/contexts/RedirectContext"
// import { CalendarEvent } from "../types"

// function getHeight(time: string) {
//     const [start, end] = time.split(" - ")
//     const duration = parseTimeToMinutes(end) - parseTimeToMinutes(start)
//     const ratio = 960 / (24 * 60)
//     return duration * ratio
// }

// const groupOverlappingEvents = (events: CalendarEvent[]): CalendarEvent[] => {
//     const sorted = [...events].sort((a, b) => parseTimeToMinutes(a.time.split(" - ")[0]) - parseTimeToMinutes(b.time.split(" - ")[0]))
//     const positioned: CalendarEvent[] = []

//     sorted.forEach((event) => {
//         const [startA, endA] = event.time.split(" - ").map(parseTimeToMinutes)
//         let groupIndex = 0
//         while (true) {
//             const overlap = positioned.some((e) =>
//                 e.group === groupIndex &&
//                 Math.max(startA, parseTimeToMinutes(e.time.split(" - ")[0])) < Math.min(endA, parseTimeToMinutes(e.time.split(" - ")[1])),
//             )
//             if (!overlap) break
//             groupIndex++
//         }
//         positioned.push({ ...event, group: groupIndex })
//     })

//     const maxGroup = Math.max(...positioned.map((e) => e.group), 0) + 1
//     return positioned.map((e) => ({
//         ...e,
//         offset: e.group,
//         total: maxGroup,
//     }))
// }

// export const DayView = ({ date, type, view }) => {
//     const [events, setEvents] = useState<CalendarEvent[]>([])
//     const [now, setNow] = useState(new Date())
//     const [showConfirmModal, setShowConfirmModal] = useState(false)
//     const [targetEvent, setTargetEvent] = useState<CalendarEvent | null>(null)
//     const [eventOriginal, setEventOriginal] = useState<CalendarEvent[]>([])
//     const [changeConfirm, setChangeConfirm] = useState({
//         dayFrom: "",
//         dayTo: "",
//         timeFrom: "",
//         timeTo: "",
//         dayOldFrom: "",
//         dayOldTo: "",
//         timeOldFrom: "",
//         timeOldTo: "",
//         title: ""
//     })

//     const [isDragging, setIsDragging] = useState(false)
//     const [dragOverArea, setDragOverArea] = useState(false)
//     const [draggedEventId, setDraggedEventId] = useState<string | null>(null)

//     const [isOpenFormEventDetail, setIsOpenFormEventDetail] = useState(false)
//     const [info, setInfo] = useState({
//         id: null,
//         title: null,
//     })

//     const { DroppableDay, DraggableEvent, sensors, formatToDateTime } = useCalendar()
//     const { reloadKey } = useCalendarReload()
//     const { id: calendarId, clearId, type: typeNoti } = useRedirect()

//     useEffect(() => {
//         if (calendarId && (typeNoti === 3 || typeNoti === 9)) handleOpenFormOutside(calendarId)
//     }, [calendarId])

//     const handleOpenFormOutside = (calendarId: string) => {
//         setInfo({ ...info, id: calendarId })
//         setIsOpenFormEventDetail(true)
//     }

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setNow(new Date())
//         }, 30000)
//         return () => clearInterval(timer)
//     }, [date])

//     useEffect(() => {
//         fetchDataCalendarByDay()
//     }, [date, type, view, reloadKey.day])

//     const getYFromTime = (date: Date) => {
//         const hours = date.getHours()
//         const minutes = date.getMinutes()
//         const totalMinutes = hours * 60 + minutes
//         const ratio = 960 / (24 * 60) // chiều cao 960px = 24 giờ
//         return {
//             top: totalMinutes * ratio,
//             hours,
//             minutes,
//         }
//     }

//     const timeSlots = Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, "0")}`)

//     const handleDragStart = ({ active }: DragStartEvent) => {
//         setIsDragging(true)
//         setDraggedEventId(String(active.id))
//     }

//     const handleDragOver = ({ over }: DragOverEvent) => {
//         // Chỉ cho phép hover trên DroppableDay (ID là "day")
//         if (over && over.id === "day") {
//             setDragOverArea(true)
//         } else {
//             setDragOverArea(false)
//         }
//     }

//     const handleDragEnd = async ({ active, over, delta }: DragEndEvent) => {
//         setIsDragging(false)
//         setDragOverArea(false)
//         setDraggedEventId(null)
//         // Chỉ cho phép drop trong DroppableDay (ID là "day")
//         if (!over || active.id === over.id || over.id !== "day") {
//             return
//         }
//         const draggedItem = events.find((e) => e.id === active.id) as CalendarEvent | undefined
//         if (!draggedItem) return
//         const isDisabled = (draggedItem.fromTime && isAfter(new Date(), parseISO(draggedItem.fromTime)));

//         // Lưu trạng thái trước khi cập nhật
//         setEventOriginal([...events])

//         const ratio = 960 / (24 * 60)
//         const moveMinutes = Math.round(delta.y / ratio)

//         const updated = events.map((e) => {
//             if (e.id === active.id) {
//                 const [startStr, endStr] = e.time.split(" - ")

//                 const originalStart = new Date(`${e.dayFrom}T${startStr}`)
//                 const originalEnd = new Date(`${e.dayTo}T${endStr}`)

//                 originalStart.setMinutes(originalStart.getMinutes() + moveMinutes)
//                 originalEnd.setMinutes(originalEnd.getMinutes() + moveMinutes)

//                 const newTime = `${originalStart.toTimeString().slice(0, 5)} - ${originalEnd.toTimeString().slice(0, 5)}`
//                 return {
//                     ...e,
//                     time: newTime,
//                 }
//             }
//             return e
//         })
//         const draggedItemAfter = updated.find((e) => e.id === active.id)
//         if (!draggedItemAfter) return
//         const layoutEvents = groupOverlappingEvents(updated)
//         const { dayFrom, dayTo, time, title } = draggedItemAfter
//         const old = {
//             dayOldFrom: draggedItem.dayFrom,
//             dayOldTo: draggedItem.dayTo,
//             timeOldFrom: draggedItem.time.split(" - ")[0],
//             timeOldTo: draggedItem.time.split(" - ")[1]
//         }
//         const { dayOldFrom, dayOldTo, timeOldFrom, timeOldTo } = old;
//         const timeConvert = {
//             timeFrom: time.split(" - ")[0],
//             timeTo: time.split(" - ")[1],
//         }
//         const { timeFrom, timeTo } = timeConvert;
//         setChangeConfirm({
//             dayFrom,
//             dayTo,
//             timeFrom,
//             timeTo,
//             title,
//             dayOldFrom,
//             dayOldTo,
//             timeOldFrom,
//             timeOldTo
//         })
//         setEvents(layoutEvents)
//         setTargetEvent(draggedItemAfter)
//         setShowConfirmModal(true)
//         const isDifferentTime = timeFrom !== timeOldFrom || timeTo !== timeOldTo;

//         if (isDifferentTime) {
//             // Hiển thị popup xác nhận
//             setShowConfirmModal(true)
//         }
//     }

//     const handleConfirmChangeTime = async () => { }

//     const handleCancelChangeTime = () => {
//         setEvents(eventOriginal)
//         setShowConfirmModal(false)
//         setTargetEvent(null)
//         setChangeConfirm({})
//     }

//     return (
//         <>
//             <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragStart={handleDragStart}
//                 onDragOver={handleDragOver}
//                 onDragEnd={handleDragEnd}
//             >
//                 <div className="bg-white rounded-xl shadow overflow-hidden relative select-none">
//                     <div className="px-6 py-4 border-b text-blue-600 font-medium">
//                         {new Date(date).toLocaleDateString("vi-VN", {
//                             weekday: "long",
//                             day: "2-digit",
//                             month: "2-digit",
//                             year: "numeric",
//                         })}
//                     </div>

//                     <div className="relative h-[960px] border-l border-blue-300">
//                         {timeSlots.map((time, i) => (
//                             <div key={i} className="h-[80px] border-t border-gray-300 text-xs text-gray-400 flex items-start">
//                                 <div
//                                     className={`w-16 text-center pt-1 text-xs font-medium transition-colors duration-200 ${isDragging ? "text-gray-600 bg-white bg-opacity-80 rounded px-1" : "text-gray-500"
//                                         }`}
//                                 >
//                                     {time}
//                                 </div>
//                                 <div className="flex-1 border-l border-dotted border-gray-200"></div>
//                             </div>
//                         ))}

//                         {/* Timeline đỏ "bây giờ" */}
//                         {isSameDay(now, new Date(date)) && (
//                             <div
//                                 className="absolute left-0 right-0 h-[1.5px] bg-red-500 z-50"
//                                 style={{ top: `${getYFromTime(now).top}px` }}
//                             >
//                                 <div className="absolute -left-1.5 top-[-4px] w-3 h-3 rounded-full bg-red-500 shadow" />
//                                 <p className="text-xs text-white bg-red-600 px-1 rounded absolute left-[25px] -translate-x-1/2 -top-5">
//                                     {getYFromTime(now).hours}:{getYFromTime(now).minutes.toString().padStart(2, "0")}
//                                 </p>
//                             </div>
//                         )}

//                         <DroppableDay
//                             id="day"
//                             className="absolute top-0 left-[5rem] w-[calc(100%-5rem)] h-full overflow-hidden"
//                             style={{
//                                 clipPath: isDragging ? "inset(2px)" : "none",
//                             }}
//                         >
//                             <div className="relative w-full h-[960px]">
//                                 {events.map((event, index) => {
//                                     const top = getTopOffset(event.time)
//                                     const height = getHeight(event.time) > 50 ? getHeight(event.time) : 60
//                                     const width = 100 / event.total
//                                     const leftOffset = event.offset * width

//                                     return (
//                                         <DraggableEvent
//                                             key={event.id}
//                                             id={event.id}
//                                             event={event}
//                                             style={{
//                                                 top,
//                                                 height,
//                                                 left: `calc(${leftOffset}% + 2px)`,
//                                                 width: `calc(${width}% - 4px)`,
//                                                 position: "absolute",
//                                                 transform: "none",
//                                                 // Thêm z-index cao nhất khi drag
//                                                 zIndex: draggedEventId === event.id ? 9999 : "auto",
//                                                 // Thêm border khi drag
//                                                 ...(isDragging
//                                                     ? {
//                                                         borderTop: "1px solid rgba(59, 130, 246, 0.3)",
//                                                         borderRight: "1px solid rgba(59, 130, 246, 0.3)",
//                                                         borderBottom: "1px solid rgba(59, 130, 246, 0.3)",
//                                                         // Giữ nguyên borderLeft với màu gốc
//                                                     }
//                                                     : {}),
//                                                 border: '1px solid white',
//                                                 backgroundColor: event.color
//                                             }}
//                                         >
//                                             {(() => {
//                                                 const isDisabled = (event.fromTime && isAfter(new Date(), parseISO(event.fromTime)));
//                                                 return (
//                                                     <div
//                                                         onClick={() => {
//                                                             const { id, title } = event
//                                                             setIsOpenFormEventDetail(true)
//                                                             setInfo({
//                                                                 id,
//                                                                 title,
//                                                             })
//                                                         }}
//                                                         className={`relative px-2 py-1 text-sm overflow-hidden transition-all duration-200 ease-in-out border-l-2 h-full ${isDisabled ? 'cursor-pointer active:scale-[0.98] active:brightness-95' : 'cursor-move active:scale-95'
//                                                             }`}
//                                                         style={{ borderLeftColor: event.colorMain }}
//                                                     >
//                                                         <p
//                                                             className={`font-semibold whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-700 font-bold" : "text-gray-800"
//                                                                 }`}
//                                                         >
//                                                             {event.title}
//                                                         </p>
//                                                         <div className="text-xs flex flex-col md:flex-row flex-wrap items-start gap-1 mt-1">
//                                                             <span
//                                                                 className={`flex items-center gap-1 truncate transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-600 font-semibold" : "text-gray-600"
//                                                                     }`}
//                                                             >
//                                                                 <Clock9 size={15} />
//                                                                 {event.time}
//                                                             </span>
//                                                             {event.location && (
//                                                                 <span
//                                                                     className={`flex items-center gap-1 truncate transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-600" : "text-gray-600"
//                                                                         }`}
//                                                                 >
//                                                                     <MapPin size={15} /> {event.location}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                         {
//                                                             event.icon['other'].content
//                                                         }
//                                                     </div>
//                                                 );
//                                             })()}
//                                         </DraggableEvent>
//                                     )
//                                 })}
//                             </div>
//                         </DroppableDay>

//                         {/* Overlay để ngăn drag ra ngoài */}
//                         {isDragging && (
//                             <div className="absolute inset-0 pointer-events-none z-30 border-2 border-blue-400 rounded-xl shadow-lg" />
//                         )}
//                     </div>
//                 </div>
//             </DndContext>

//             {
//                 showConfirmModal && (
//                     <ConfirmModalChangeTime
//                         title="Xác nhận thay đổi lịch"
//                         isOpen={showConfirmModal}
//                         onClose={handleCancelChangeTime}
//                         onConfirm={handleConfirmChangeTime}
//                         content={
//                             <ConfirmChangeTime
//                                 eventName={changeConfirm?.title}
//                                 from={
//                                     {
//                                         startTime: changeConfirm?.timeOldFrom,
//                                         startDate: convertDateTimeToDate(changeConfirm?.dayOldFrom, "dd/MM/yyyy"),
//                                         endTime: changeConfirm?.timeOldTo,
//                                         endDate: convertDateTimeToDate(changeConfirm?.dayOldTo, "dd/MM/yyyy")
//                                     }
//                                 }
//                                 to={
//                                     {
//                                         startTime: changeConfirm?.timeFrom,
//                                         startDate: convertDateTimeToDate(changeConfirm?.dayFrom, "dd/MM/yyyy"),
//                                         endTime: changeConfirm?.timeTo,
//                                         endDate: convertDateTimeToDate(changeConfirm?.dayTo, "dd/MM/yyyy")
//                                     }
//                                 }
//                             />
//                         }
//                     />
//                 )
//             }
//         </>
//     )
// }