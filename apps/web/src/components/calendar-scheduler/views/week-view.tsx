import { useEffect, useState, useRef, useCallback, useContext, useMemo } from "react"
import { getTopOffset, parseTimeToMinutes } from "@/helpers/numberHelpers"
import { convertDateTimeToDate } from "@/helpers/stringHelpers"
import { useCalendar } from "../../../hooks/useCalendar"
import { closestCenter, DndContext, DragStartEvent } from "@dnd-kit/core"
import { useToast } from "@/contexts/ToastContext"
import { useCalendarReload } from "@/contexts/CalendarReloadContext"
import LoadingContext from "@/contexts/LoadingContext"
import ConfirmModalChangeTime from "./confirmModalChangeTime"
import { isAfter, parseISO } from "date-fns"
import ConfirmChangeTime from "../forms/confirm-change-time"
import { useRedirect } from "@/contexts/RedirectContext"
import { CalendarEvent } from "../types"

const MULTI_DAY_EVENT_HEIGHT = 28 // Chiều cao sự kiện cả ngày

function getHeight(time: string) {
    const [start, end] = time.split(" - ")
    const duration = parseTimeToMinutes(end) - parseTimeToMinutes(start)
    const ratio = 960 / (24 * 60)
    const minHeight = 70 // Tăng minHeight để đảm bảo đủ không gian cho nội dung
    return Math.max(duration * ratio, minHeight)
}

function formatDate(d: Date) {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, "0")
    const day = d.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
}

// Kiểm tra sự kiện cả ngày (all-day event)
function isAllDayEvent(event: CalendarEvent) {
    return event.time === "00:00 - 00:00"
}

// Hàm mới để xử lý các sự kiện dài ngày
function handleMultiDayEvents(events: CalendarEvent[], weekLabels: { value: string }[]) {
    const multiDayEvents = []
    const singleDayEvents = {}
    weekLabels.forEach(day => singleDayEvents[day.value] = []);

    events.forEach(event => {
        // Kiểm tra và phân loại sự kiện ngay từ đầu
        const eventIsMultiDay = new Date(event.dayFrom).getTime() !== new Date(event.dayTo).getTime();

        if (eventIsMultiDay) {
            multiDayEvents.push({ ...event, isMultiDay: true });
        } else {
            if (singleDayEvents[event.dayFrom]) {
                singleDayEvents[event.dayFrom].push({ ...event, isMultiDay: false });
            }
        }
    });

    return { multiDayEvents, singleDayEvents };
}

function groupSingleDayEvents(eventsByDay) {
    const finalLayoutEvents = [];

    for (const day in eventsByDay) {
        const dayEvents = eventsByDay[day];

        const sorted = [...dayEvents].sort((a, b) => {
            const aStart = parseTimeToMinutes(a.time.split(" - ")[0]);
            const bStart = parseTimeToMinutes(b.time.split(" - ")[0]);
            return aStart - bStart;
        });

        const lanes = [];
        let maxLanesUsed = 0;

        sorted.forEach((event) => {
            const [start, end] = event.time.split(" - ").map(parseTimeToMinutes);
            let assignedLane = -1;

            for (let i = 0; i < lanes.length; i++) {
                let canFit = true;
                // Kiểm tra chồng lấn trong cùng một "lane" của một ngày
                for (const existingEvent of lanes[i]) {
                    const [exStartEvent, exEndEvent] = existingEvent.time.split(" - ").map(parseTimeToMinutes);
                    if (!(end <= exStartEvent || start >= exEndEvent)) {
                        canFit = false;
                        break;
                    }
                }
                if (canFit) {
                    lanes[i].push(event);
                    assignedLane = i;
                    break;
                }
            }

            if (assignedLane === -1) {
                lanes.push([event]);
                assignedLane = lanes.length - 1;
            }
            event.offset = assignedLane;
            maxLanesUsed = Math.max(maxLanesUsed, lanes.length);
            finalLayoutEvents.push(event);
        });

        // Cập nhật total cho tất cả sự kiện trong ngày
        finalLayoutEvents
            .filter(e => e.dayFrom === day)
            .forEach(e => {
                e.total = maxLanesUsed;
            });
    }

    return finalLayoutEvents;
}


const getWeekLabels = (fromDate, toDate) => {
    const labels = []
    const current = new Date(fromDate)
    current.setHours(0, 0, 0, 0)

    while (current <= new Date(toDate)) {
        const d = new Date(current)
        labels.push({
            date: d,
            label: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
            labelFull: d.toLocaleDateString("vi-VN", { day: "2-digit", weekday: "short" }),
            value: formatDate(d),
        })
        current.setDate(current.getDate() + 1)
    }

    return labels
}

export const WeekView = ({ fromDate, toDate, type, joinType, view }) => {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [targetEvent, setTargetEvent] = useState<CalendarEvent | null>(null)
    const [eventOriginal, setEventOriginal] = useState<CalendarEvent | null>(null)
    const [changeConfirm, setChangeConfirm] = useState({
        dayFrom: "",
        dayTo: "",
        timeFrom: "",
        timeTo: "",
        dayOldFrom: "",
        dayOldTo: "",
        timeOldFrom: "",
        timeOldTo: "",
        title: ""
    })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOverColumn, setDragOverColumn] = useState(null)
    const [draggedEventId, setDraggedEventId] = useState<string | null>(null)
    const [draggedEventTime, setDraggedEventTime] = useState(null)

    // Thêm ref để throttle drag move
    const dragMoveTimeoutRef = useRef(null)

    const gridRef = useRef(null)
    const { convertToEvent, DraggableEvent, DroppableDay, sensors, formatToDateTime } = useCalendar()
    const toast = useToast()
    const { reloadKey } = useCalendarReload()
    const loadingContext = useContext(LoadingContext);
    const { id: calendarId, clearId, type: typeNoti } = useRedirect()

    useEffect(() => {
        if (calendarId && (typeNoti === 3 || typeNoti === 9)) handleOpenFormOutside(calendarId)
    }, [calendarId])

    const handleOpenFormOutside = (calendarId: string) => {
        setInfo({ ...info, id: calendarId })
        setIsOpenFormEventDetail(true)
    }

    const [now, setNow] = useState(new Date())

    const [isOpenFormEventDetail, setIsOpenFormEventDetail] = useState(false)

    const [info, setInfo] = useState({
        id: null,
        title: null,
    })

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000)
        return () => clearInterval(timer)
    }, [fromDate, toDate])

    const getYFromTime = (date: Date) => {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const totalMinutes = hours * 60 + minutes
        const ratio = 960 / (24 * 60) // 960px là chiều cao tổng
        return {
            top: totalMinutes * ratio,
            hours,
            minutes,
        }
    }

    const gridColumnsStyle = `repeat(7, minmax(120px, 1fr))`

    const timeSlots = Array.from({ length: 12 }, (_, i) => `${(i * 2).toString().padStart(2, "0")}`)
    const weekLabels = useMemo(() => getWeekLabels(fromDate, toDate), [fromDate, toDate])

    const handleResize = () => { }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const singleDayEvents = events.filter((event) => !event.isMultiDay)
    const multiDayEvents = events.filter((event) => event.isMultiDay)
    const multiDayAllDayEvents = multiDayEvents.filter(isAllDayEvent);
    const multiDayTimedEvents = multiDayEvents.filter(e => !isAllDayEvent(e));


    const handleDragStart = (e: DragStartEvent) => {
        setIsDragging(true)
        setDraggedEventId(String(e.active.id))
        const draggedEvent = events.find((e) => e.id === e.active.id)
        if (draggedEvent) {
            setDraggedEventTime({ originalTime: draggedEvent.time, currentTime: draggedEvent.time })
        }
    }

    const handleDragOver = ({ over }) => {
        if (over) {
            const columnIndex = Number.parseInt(over.id)
            setDragOverColumn(columnIndex)
        }
    }

    const handleDragMove = useCallback(
        ({ delta }) => {
            if (draggedEventTime && delta && !isAllDayEvent(events.find((e) => e.id === draggedEventId))) {
                if (dragMoveTimeoutRef.current) {
                    clearTimeout(dragMoveTimeoutRef.current)
                }
            }
        },
        [draggedEventTime, draggedEventId, events],
    )

    const handleDragEnd = ({ active, over, delta }) => {
        if (dragMoveTimeoutRef.current) {
            clearTimeout(dragMoveTimeoutRef.current)
        }

        setIsDragging(false)
        setDragOverColumn(null)
        setDraggedEventId(null)
        setDraggedEventTime(null)

        if (!over || active.id === over.id || over.id.toString().length > 2 || isNaN(over.id)) {
            return
        }

        const dragged = events.find((e) => e.id === active.id)
        if (!dragged) return

        setEventOriginal([...events])

        const dayIndex = Number.parseInt(over.id)
        const newDropDayValue = weekLabels[dayIndex]?.value
        if (!newDropDayValue) return

        const ratio = 960 / (24 * 60)
        const moveMinutes = Math.round(delta.y / ratio)

        const updated = events.map((e) => {
            if (e.id === active.id) {
                const originalStartDateTime = new Date(e.originalStartTime || `${e.dayFrom}T${e.time.split(" - ")[0]}`)
                const originalEndDateTime = new Date(e.originalEndTime || `${e.dayTo}T${e.time.split(" - ")[1]}`)

                const oldStartDayIndex = weekLabels.findIndex((w) => w.value === e.dayFrom)
                const dayDifference = dayIndex - oldStartDayIndex

                const newStartDateTime = new Date(originalStartDateTime.getTime());
                const newEndDateTime = new Date(originalEndDateTime.getTime());

                // Di chuyển ngày
                newStartDateTime.setDate(newStartDateTime.getDate() + dayDifference);
                newEndDateTime.setDate(newEndDateTime.getDate() + dayDifference);

                // Di chuyển thời gian (chỉ áp dụng cho sự kiện có thời gian)
                if (!isAllDayEvent(e)) {
                    newStartDateTime.setMinutes(newStartDateTime.getMinutes() + moveMinutes);
                    newEndDateTime.setMinutes(newEndDateTime.getMinutes() + moveMinutes);
                }

                const newDayFrom = formatDate(newStartDateTime);
                const newDayTo = formatDate(newEndDateTime);
                const newTime = `${newStartDateTime.toTimeString().substring(0, 5)} - ${newEndDateTime.toTimeString().substring(0, 5)}`;

                return {
                    ...e,
                    dayFrom: newDayFrom,
                    dayTo: newDayTo,
                    time: newTime,
                    originalStartTime: newStartDateTime.toISOString(),
                    originalEndTime: newEndDateTime.toISOString(),
                }
            }
            return e
        })

        const draggedItemAfter = updated.find((e) => e.id === active.id)
        const { multiDayEvents: newMultiDayEvents, singleDayEvents: newSingleDayEvents } = handleMultiDayEvents(updated, weekLabels);
        const layoutSingleDayEvents = groupSingleDayEvents(newSingleDayEvents);
        const newEvents = [...newMultiDayEvents, ...layoutSingleDayEvents];

        setEvents(newEvents);
        setTargetEvent(draggedItemAfter)

        const { dayFrom, dayTo, time, title } = draggedItemAfter
        const old = {
            dayOldFrom: dragged.dayFrom,
            dayOldTo: dragged.dayTo,
            timeOldFrom: dragged.time.split(" - ")[0],
            timeOldTo: dragged.time.split(" - ")[1]
        }
        const { dayOldFrom, dayOldTo, timeOldFrom, timeOldTo } = old;
        const timeConvert = {
            timeFrom: time.split(" - ")[0],
            timeTo: time.split(" - ")[1],
        }
        const { timeFrom, timeTo } = timeConvert;
        setChangeConfirm({
            dayFrom,
            dayTo,
            timeFrom,
            timeTo,
            title,
            dayOldFrom,
            dayOldTo,
            timeOldFrom,
            timeOldTo
        })

        const isDifferentDay = dayFrom !== dayOldFrom || dayTo !== dayOldTo;
        const isSameDay = dayFrom === dayOldFrom && dayTo === dayOldTo;
        const isDifferentTime = timeFrom !== timeOldFrom || timeTo !== timeOldTo;

        if (isDifferentDay || (isSameDay && isDifferentTime)) {
            setShowConfirmModal(true)
        }
    }

    useEffect(() => {
        return () => {
            if (dragMoveTimeoutRef.current) {
                clearTimeout(dragMoveTimeoutRef.current)
            }
        }
    }, [])

    const handleConfirmChangeTime = async () => {
    }

    const handleCancelChangeTime = () => {
        setEvents(eventOriginal)
        setShowConfirmModal(false)
        setTargetEvent(null)
        setChangeConfirm({})
    }

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
            >
                <div className="bg-gray-50 select-none">
                    <div className="mx-auto bg-white rounded-xl shadow overflow-hidden relative">
                        <div className="w-full">
                            <div className="h-8 flex border-b border-gray-200">
                                <div className="w-12 flex-shrink-0"></div>
                                <div
                                    className="flex-1 grid"
                                    ref={gridRef}
                                    style={{
                                        gridTemplateColumns: gridColumnsStyle,
                                        minWidth: `calc(7 * 120px)`,
                                    }}
                                >
                                    {weekLabels.map(({ label, labelFull }, i) => (
                                        <div
                                            key={i}
                                            className={`text-center text-xs sm:text-sm font-medium border-r border-gray-200 last:border-r-0 transition-all duration-200 py-1 ${isDragging && dragOverColumn === i
                                                ? "bg-blue-100 text-blue-700 shadow-sm"
                                                : isDragging
                                                    ? "bg-gray-50 text-gray-500"
                                                    : ""
                                                }`}
                                        >
                                            <span className="block lg:hidden">{label}</span>
                                            <span className="hidden lg:block">{labelFull}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Khu vực sự kiện cả ngày kéo dài nhiều ngày */}
                            {multiDayAllDayEvents.length > 0 && (
                                <div
                                    className="relative flex border-b border-gray-200"
                                    style={{ minWidth: `calc(7 * 120px)`, height: `${MULTI_DAY_EVENT_HEIGHT + 10}px` }}
                                >
                                    <div className="w-12 shrink-0"></div>
                                    <div className="flex-1 grid relative" style={{ gridTemplateColumns: gridColumnsStyle }}>
                                        {multiDayTimedEvents.map((event) => {
                                            const top = getTopOffset(event.time)
                                            const rawHeight = getHeight(event.time)
                                            const finalHeight = `calc(${rawHeight}px - 2px)`

                                            const startIndex = weekLabels.findIndex((w) => w.value === event.dayFrom)
                                            const endIndex = weekLabels.findIndex((w) => w.value === event.dayTo)

                                            // Kiểm tra xem sự kiện có bắt đầu hoặc kết thúc trong tuần hiện tại không
                                            if (startIndex === -1 && endIndex === -1) {
                                                // Nếu sự kiện không nằm trong tuần này, không render nó
                                                return null;
                                            }

                                            // Tính toán gridColumnStart và gridColumnEnd cho sự kiện dài ngày
                                            const effectiveStartIndex = startIndex !== -1 ? startIndex : 0;
                                            const effectiveEndIndex = endIndex !== -1 ? endIndex : 6;
                                            const gridColumnStart = effectiveStartIndex + 1;
                                            const gridColumnEnd = effectiveEndIndex + 2;

                                            return (
                                                <DraggableEvent
                                                    key={event.id}
                                                    id={event.id}
                                                    event={event}
                                                    style={{
                                                        top: top,
                                                        height: finalHeight,
                                                        gridColumnStart: gridColumnStart,
                                                        gridColumnEnd: gridColumnEnd,
                                                        position: "absolute",
                                                        left: "2px",
                                                        width: "calc(100% - 4px)",
                                                        zIndex: 15,
                                                        backgroundColor: event.color || "#d6e9f7",
                                                        transform: "none",
                                                        border: '1px solid white'
                                                    }}
                                                >
                                                    <div onClick={() => {
                                                        const { id, title } = event
                                                        setIsOpenFormEventDetail(true)
                                                        setInfo({
                                                            id,
                                                            title,
                                                        })
                                                    }} className="mt-0 py-[2px] rounded text-xs overflow-hidden h-full w-full flex flex-col cursor-move transition-all duration-200 ease-in-out active:scale-95">
                                                        <div style={{ borderLeftColor: event.colorMain }} className={`space-y-1 border-l-2 h-full pr-2 pl-2`}>
                                                            <p
                                                                className={`font-semibold text-[11px] leading-tight text-ellipsis overflow-hidden whitespace-nowrap min-w-[40px] transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-700 font-bold" : "text-gray-800"
                                                                    }`}
                                                            >
                                                                {event.title}
                                                            </p>
                                                            <p
                                                                className={`text-[10px] leading-none truncate min-w-[40px] transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-600 font-semibold" : "text-gray-600"
                                                                    }`}
                                                            >
                                                                {draggedEventId === event.id && draggedEventTime && !isAllDayEvent(event)
                                                                    ? draggedEventTime.currentTime
                                                                    : event.time}
                                                            </p>
                                                        </div>
                                                        {
                                                            event.icon['other'].content
                                                        }
                                                    </div>
                                                </DraggableEvent>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Thay đổi chiều cao của container lưới thời gian để có khoảng trống cuối cùng */}
                            <div className="relative border-t border-blue-300" style={{ height: "calc(12 * 80px + 100px)" }}>
                                {" "}
                                {/* Thêm 100px khoảng trắng */}
                                {timeSlots.map((time, i) => (
                                    <div
                                        key={i}
                                        className="h-[80px] border-t border-dotted border-gray-300 text-xs text-gray-400 flex items-start"
                                    >
                                        <div className="w-16 flex-shrink-0 text-center pt-1 text-gray-500 text-xs font-medium">{time}</div>
                                        <div className="flex-1 grid" style={{ gridTemplateColumns: gridColumnsStyle }}>
                                            {weekLabels.map((_, colIndex) => (
                                                <div key={colIndex} className="border-l border-dotted border-gray-200 last:border-r-0"></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {/* Các DroppableDay trải dài toàn bộ chiều cao mới */}
                                <div
                                    className="absolute top-0 left-12 right-0 h-full grid z-0"
                                    style={{ gridTemplateColumns: gridColumnsStyle }}
                                >
                                    {weekLabels.map((dayInfo, index) => (
                                        <DroppableDay
                                            key={index}
                                            id={`${index}`}
                                            className={`relative h-[960px] border-r border-gray-200 min-w-0 transition-colors duration-200 ${isDragging && dragOverColumn === index
                                                ? "bg-blue-50 bg-opacity-50 border-blue-300"
                                                : isDragging
                                                    ? "bg-gray-50 bg-opacity-30"
                                                    : ""
                                                }`}
                                            style={{
                                                background:
                                                    isDragging && dragOverColumn === index
                                                        ? "linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)"
                                                        : isDragging
                                                            ? "rgba(249, 250, 251, 0.3)"
                                                            : "transparent",
                                            }}
                                        />
                                    ))}
                                </div>
                                {/* Time slots overlay để đảm bảo luôn hiển thị */}
                                {isDragging && (
                                    <div className="absolute top-0 left-0 right-0 h-full pointer-events-none z-5">
                                        {timeSlots.map((time, i) => (
                                            <div
                                                key={i}
                                                className="h-[80px] border-t border-dotted border-gray-400 opacity-60"
                                                style={{ top: `${i * 80}px` }}
                                            >
                                                <div className="w-16 flex-shrink-0 text-center pt-1 text-gray-600 text-xs font-medium bg-white bg-opacity-80 rounded px-1">
                                                    {time}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="absolute top-0 left-12 h-full z-10 w-[calc(100%-48px)]">
                                    <div className="relative h-full grid" style={{ gridTemplateColumns: gridColumnsStyle }}>
                                        {/* Render sự kiện một ngày và sự kiện kéo dài nhiều ngày có thời gian */}
                                        {singleDayEvents.map((event) => {
                                            const top = getTopOffset(event.time)
                                            const rawHeight = getHeight(event.time)
                                            const finalHeight = `calc(${rawHeight}px - 2px)`

                                            const startIndex = weekLabels.findIndex((w) => w.value === event.dayFrom)
                                            if (startIndex === -1) return null

                                            const eventLaneWidth = 100 / (event.total > 0 ? event.total : 1)
                                            const eventLaneLeft = eventLaneWidth * event.offset
                                            const eventLeft = `calc(${eventLaneLeft}% + 2px)`
                                            const eventWidth = `calc(${eventLaneWidth}% - 4px)`

                                            const isDisabled =
                                                event.isCanceled ||
                                                event.isLocked ||
                                                event.typeUserJoin ||
                                                (event.fromTime && isAfter(new Date(), parseISO(event.fromTime)));

                                            return (
                                                <DraggableEvent
                                                    key={event.id}
                                                    id={event.id}
                                                    event={event}
                                                    style={{
                                                        top: top,
                                                        height: finalHeight,
                                                        gridColumnStart: startIndex + 1,
                                                        gridColumnEnd: startIndex + 2,
                                                        position: "absolute",
                                                        left: eventLeft,
                                                        width: eventWidth,
                                                        zIndex: event.offset + 1,
                                                        backgroundColor: event.color || "#a7f3d0",
                                                        transform: "none",
                                                        border: '1px solid white'
                                                    }}
                                                >
                                                    <div onClick={() => {
                                                        const { id, title } = event
                                                        setIsOpenFormEventDetail(true)
                                                        setInfo({
                                                            id,
                                                            title,
                                                        })
                                                    }} className={`mt-0 py-[2px] rounded text-xs overflow-hidden h-full w-full flex flex-col transition-all duration-200 ease-in-out ${isDisabled ? 'cursor-pointer active:scale-[0.98] active:brightness-95' : 'cursor-move active:scale-95'
                                                        }`}>
                                                        <div style={{ borderLeftColor: event.colorMain }} className={`space-y-1 border-l-2 h-full pr-2 pl-2`}>
                                                            <p
                                                                className={`font-semibold text-[11px] leading-tight text-ellipsis overflow-hidden whitespace-nowrap min-w-[40px] transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-700 font-bold" : "text-gray-800"
                                                                    }`}
                                                            >
                                                                {event.title}
                                                            </p>
                                                            <p
                                                                className={`text-[10px] leading-none truncate min-w-[40px] transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-600 font-semibold" : "text-gray-600"
                                                                    }`}
                                                            >
                                                                {draggedEventId === event.id && draggedEventTime && !isAllDayEvent(event)
                                                                    ? draggedEventTime.currentTime
                                                                    : event.time}
                                                            </p>
                                                        </div>
                                                        {
                                                            event.icon['other'].content
                                                        }
                                                    </div>
                                                </DraggableEvent>
                                            )
                                        })}

                                        {/* Render sự kiện kéo dài nhiều ngày có thời gian */}
                                        {multiDayTimedEvents.map((event) => {
                                            const top = getTopOffset(event.time)
                                            const rawHeight = getHeight(event.time)
                                            const finalHeight = `calc(${rawHeight}px - 2px)`

                                            const startIndex = weekLabels.findIndex((w) => w.value === event.dayFrom)
                                            const endIndex = weekLabels.findIndex((w) => w.value === event.dayTo)

                                            // Kiểm tra xem sự kiện có bắt đầu hoặc kết thúc trong tuần hiện tại không
                                            if (startIndex === -1 && endIndex === -1) {
                                                // Nếu sự kiện không nằm trong tuần này, không render nó
                                                return null;
                                            }

                                            // Tính toán gridColumnStart và gridColumnEnd cho sự kiện dài ngày
                                            const effectiveStartIndex = startIndex !== -1 ? startIndex : 0;
                                            const effectiveEndIndex = endIndex !== -1 ? endIndex : 6;
                                            const gridColumnStart = effectiveStartIndex + 1;
                                            const gridColumnEnd = effectiveEndIndex + 2;

                                            const isDisabled =
                                                event.isCanceled ||
                                                event.isLocked ||
                                                event.typeUserJoin ||
                                                (event.fromTime && isAfter(new Date(), parseISO(event.fromTime)));

                                            return (
                                                <DraggableEvent
                                                    key={event.id}
                                                    id={event.id}
                                                    event={event}
                                                    style={{
                                                        top: top,
                                                        height: finalHeight,
                                                        gridColumnStart: gridColumnStart,
                                                        gridColumnEnd: gridColumnEnd,
                                                        position: "absolute",
                                                        left: "2px",
                                                        width: "calc(100% - 4px)",
                                                        zIndex: 15,
                                                        backgroundColor: event.color || "#d6e9f7",
                                                        transform: "none",
                                                        border: '1px solid white'
                                                    }}
                                                >
                                                    <div onClick={() => {
                                                        const { id, title } = event
                                                        setIsOpenFormEventDetail(true)
                                                        setInfo({
                                                            id,
                                                            title,
                                                        })
                                                    }} className={`mt-0 py-[2px] rounded text-xs overflow-hidden h-full w-full flex flex-col transition-all duration-200 ease-in-out ${isDisabled ? 'cursor-pointer' : 'cursor-move active:scale-95'
                                                        }`}>
                                                        <div style={{ borderLeftColor: event.colorMain }} className={`space-y-1 border-l-2 h-full pr-2 pl-2`}>
                                                            <p
                                                                className={`font-semibold text-[11px] leading-tight text-ellipsis overflow-hidden whitespace-nowrap min-w-[40px] transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-700 font-bold" : "text-gray-800"
                                                                    }`}
                                                            >
                                                                {event.title}
                                                            </p>
                                                            <p
                                                                className={`text-[10px] leading-none truncate min-w-[40px] transition-colors duration-200 ${draggedEventId === event.id ? "text-blue-600 font-semibold" : "text-gray-600"
                                                                    }`}
                                                            >
                                                                {draggedEventId === event.id && draggedEventTime && !isAllDayEvent(event)
                                                                    ? draggedEventTime.currentTime
                                                                    : event.time}
                                                            </p>
                                                        </div>
                                                        {
                                                            event.icon['other'].content
                                                        }
                                                    </div>
                                                </DraggableEvent>
                                            )
                                        })}
                                    </div>
                                </div>
                                {weekLabels.map((day, index) => {
                                    const isToday = convertDateTimeToDate(day.date) === convertDateTimeToDate(now)
                                    if (!isToday) return null
                                    return (
                                        <div
                                            key={index}
                                            className="absolute left-0 right-0 h-[1.5px] bg-red-500 z-50"
                                            style={{
                                                top: `${getYFromTime(now).top}px`,
                                                gridColumnStart: index + 1,
                                                gridColumnEnd: index + 2,
                                            }}
                                        >
                                            <div className="absolute -left-1.5 top-[-4px] w-3 h-3 rounded-full bg-red-500 shadow" />
                                            <p className="text-xs text-white bg-red-600 px-1 rounded absolute left-[25px] -translate-x-1/2 -top-5">
                                                {getYFromTime(now).hours}:{getYFromTime(now).minutes.toString().padStart(2, "0")}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Overlay để ngăn drag ra ngoài */}
                            {isDragging && (
                                <div className="absolute inset-0 pointer-events-none z-50 border-2 border-blue-300 rounded-xl" />
                            )}
                        </div>
                    </div>
                </div>
            </DndContext>

            {
                showConfirmModal && (
                    <ConfirmModalChangeTime
                        title="Xác nhận thay đổi lịch"
                        isOpen={showConfirmModal}
                        onClose={handleCancelChangeTime}
                        onConfirm={handleConfirmChangeTime}
                        content={
                            <ConfirmChangeTime
                                eventName={changeConfirm?.title}
                                from={
                                    {
                                        startTime: changeConfirm?.timeOldFrom,
                                        startDate: convertDateTimeToDate(changeConfirm?.dayOldFrom, "dd/MM/yyyy"),
                                        endTime: changeConfirm?.timeOldTo,
                                        endDate: convertDateTimeToDate(changeConfirm?.dayOldTo, "dd/MM/yyyy")
                                    }
                                }
                                to={
                                    {
                                        startTime: changeConfirm?.timeFrom,
                                        startDate: convertDateTimeToDate(changeConfirm?.dayFrom, "dd/MM/yyyy"),
                                        endTime: changeConfirm?.timeTo,
                                        endDate: convertDateTimeToDate(changeConfirm?.dayTo, "dd/MM/yyyy")
                                    }
                                }
                            />
                        }
                    />
                )
            }
        </>
    )
}