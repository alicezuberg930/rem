"use client"

import {
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isToday, // Thêm isToday vào đây
  parseISO,
  isWithinInterval,
  differenceInCalendarDays,
  parse,
  subDays,
  format,
  isAfter,
} from "date-fns"

import { useContext, useEffect, useMemo, useRef, useState } from "react"
import { useCalendar } from "../../../hooks/useCalendar"
import { changeEventTime, changeEventTimeV2, getCalendarMonth, getCalendarMonthV2 } from "@/lib/api/calendarApi"
import { DndContext, closestCenter, DragOverlay, useDraggable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import { useToast } from "@/contexts/ToastContext"
import { ChevronDown } from "lucide-react"
import { useCalendarReload } from "@/contexts/CalendarReloadContext"
import EventDetail from "../forms/event-detail"
import ConfirmChangeTime from "../forms/confirm-change-time"
import { convertDateTimeToDate } from "@/helpers/stringHelpers"
import { CalendarConstants } from "@/constants/calendarConstants"
import { vi } from "date-fns/locale"
import LoadingContext from "@/contexts/LoadingContext"
import ConfirmModalChangeTime from "./confirmModalChangeTime"
import { useRedirect } from "@/contexts/RedirectContext"
import { useSignalR } from "@/contexts/SignalRContext"
import { useRouter, useSearchParams } from "next/navigation"

const MAX_VISIBLE_EVENTS = 3

// PopoverDraggableEvent: giống hệt DraggableEvent nhưng prefix id là popover-
function PopoverDraggableEvent({ event, children }) {
  const isDisabled =
    event.isCanceled ||
    event.isLocked ||
    event.typeUserJoin ||
    (event.fromTime && isAfter(new Date(), parseISO(event.fromTime)));
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `popover-${event.id}`,
    data: { type: "event", event, dayFrom: event.dayFrom, dayTo: event.dayTo },
    disabled: isDisabled
  })
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-move transition-all duration-200 ease-in-out",
        isDragging && "opacity-50",
        // Dòng này cần sửa:
        isDisabled ? '!cursor-pointer active:scale-[0.98] active:brightness-95' : '!cursor-grab active:!cursor-grabbing'
      )}
    >
      {children}
    </div>
  )
}

function generateCalendar(currentDate) {
  let start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
  const firstOfMonth = startOfMonth(currentDate)
  if (start.getTime() === firstOfMonth.getTime()) {
    start = subDays(start, 7)
  }
  const days = []
  for (let i = 0; i < 42; i++) days.push(addDays(start, i))
  const calendar = []
  for (let i = 0; i < 6; i++) calendar.push(days.slice(i * 7, (i + 1) * 7))
  return {
    calendar,
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  }
}

function sortEventsByStartTime(events) {
  return [...events].sort((a, b) => {
    const tA = parse(a.time.split(" - ")[0], "HH:mm", new Date())
    const tB = parse(b.time.split(" - ")[0], "HH:mm", new Date())
    if (tA.getTime() === tB.getTime()) return a.title.localeCompare(b.title)
    return tA - tB
  })
}

export const MonthView = ({ date, joinType, type, view }) => {
  const [events, setEvents] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [targetEvent, setTargetEvent] = useState(null)
  const [eventOriginal, setEventOriginal] = useState(null)
  const [changeConfirm, setChangeConfirm] = useState({})
  const [isDragging, setIsDragging] = useState(false)
  const [draggedEventId, setDraggedEventId] = useState(null)
  const [dragOverCell, setDragOverCell] = useState(null)
  const [draggedEventDuration, setDraggedEventDuration] = useState(0)
  const [isOpenFormEventDetail, setIsOpenFormEventDetail] = useState(false)
  const [info, setInfo] = useState({})
  const [openPopoverDayId, setOpenPopoverDayId] = useState(null)
  const [popoverEvents, setPopoverEvents] = useState([])
  const [selectedDate, setSelectdDate] = useState(null)
  const popoverRef = useRef(null)
  const currentDate = new Date(date)
  const { calendar, month, year } = useMemo(() => generateCalendar(currentDate), [date])
  const { convertToEvent, DraggableEvent, DroppableDay, sensors, formatToDateTime, useDraggable } = useCalendar()
  const { reloadKey } = useCalendarReload()
  const toast = useToast()
  const [activeId, setActiveId] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const calendarRef = useRef(null)
  const loadingContext = useContext(LoadingContext)
  const { sendReloadCalendar } = useSignalR()

  const params = useSearchParams()
  const idOutside = params.get("id");
  const typeOutside = params.get("type");
  
  const { id: calendarId, clearId, type: typeNoti } = useRedirect()

  const route = useRouter();
  
  useEffect(() => {
    if (idOutside) {

      handleOpenFormOutside(idOutside)
      if (Number(typeOutside) === 3)
        route.push("/calendar")
      else if (Number(typeOutside) === 9)
        route.push("/special-calendar")
    }
  }, [])

  useEffect(() => {
    if (calendarId && (typeNoti === 3 || typeNoti === 9)) handleOpenFormOutside(calendarId)
  }, [calendarId])

  const handleOpenFormOutside = (calendarId) => {
    setInfo({ ...info, id: calendarId })
    setIsOpenFormEventDetail(true)
  }

  useEffect(() => {
    const unSend = sendReloadCalendar(msg => {
      if (msg) {
        fetchDataCalendarByMonth()
      }
    })

    return unSend
  }, [])

  useEffect(() => { fetchDataCalendarByMonth() }, [joinType, type, date, view, reloadKey.month])

  const fetchDataCalendarByMonth = async () => {
  }

  const handleDragStart = ({ active }) => {
    setIsDragging(true)
    setActiveId(active.id)
    setDraggedEventId(active.id)
    setOpenPopoverDayId(null)
    setPopoverEvents([]) // fix: ẩn popover khi drag
    const rawId = active.id.toString().replace(/^calendar-/, '').replace(/^popover-/, '')
    const draggedEvent = events.find(e => e.id === rawId)
    if (draggedEvent) {
      setDraggedItem(draggedEvent)
      let oldFrom = parseISO(draggedEvent.dayFrom)
      let oldTo = parseISO(draggedEvent.dayTo)
      if (isNaN(oldFrom.getTime()) || isNaN(oldTo.getTime())) {
        oldFrom = new Date(); oldTo = new Date()
      }
      const duration = differenceInCalendarDays(oldTo, oldFrom)
      setDraggedEventDuration(duration)
    }
  }

  const handleDragOver = ({ over }) => {
    if (!over || !over.id || typeof over.id !== "string") {
      setDragOverCell(null); return
    }
    setDragOverCell(over.id)
  }

  const handleDragEnd = ({ active, over }) => {
    setIsDragging(false)
    setDraggedEventId(null)
    setDragOverCell(null)
    setDraggedEventDuration(0)
    setActiveId(null)
    setDraggedItem(null)
    if (!over || typeof over.id !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(over.id)) {
      setEvents(eventOriginal); return
    }
    const rawId = active.id.toString().replace(/^calendar-/, '').replace(/^popover-/, '')
    const dragged = events.find((e) => e.id === rawId)
    if (!dragged) return
    setEventOriginal([...events])
    const oldFrom = parseISO(dragged.dayFrom)
    const oldTo = parseISO(dragged.dayTo)
    const durationInDays = differenceInCalendarDays(oldTo, oldFrom)
    const newFromDate = parseISO(over.id)
    if (isNaN(newFromDate.getTime())) return
    const newToDate = addDays(newFromDate, durationInDays)
    const newDayFrom = format(newFromDate, "yyyy-MM-dd")
    const newDayTo = format(newToDate, "yyyy-MM-dd")
    const updated = events.map((e) =>
      e.id === rawId ? { ...e, dayFrom: newDayFrom, dayTo: newDayTo } : e,
    )
    const draggedItemAfter = updated.find((e) => e.id === rawId)
    const { dayFrom, dayTo, time, title } = draggedItemAfter
    setChangeConfirm({
      dayFrom,
      dayTo,
      timeFrom: time?.split(" - ")[0] || "",
      timeTo: time?.split(" - ")[1] || "",
      title,
      dayOldFrom: dragged.dayFrom,
      dayOldTo: dragged.dayTo,
      timeOldFrom: dragged.time?.split(" - ")[0] || "",
      timeOldTo: dragged.time?.split(" - ")[1] || "",
    })
    setEvents(updated)
    setTargetEvent(draggedItemAfter)
    if (dayFrom !== dragged.dayFrom || dayTo !== dragged.dayTo) setShowConfirmModal(true)
  }

  const handleConfirmChangeTime = async () => {
  }

  const handleCancelChangeTime = () => {
    setEvents(eventOriginal)
    setShowConfirmModal(false)
    setTargetEvent(null)
    setChangeConfirm({})
  }

  const handleOpenPopover = (dayId) => {
    if (isDragging) return
    if (openPopoverDayId === dayId) {
      setOpenPopoverDayId(null)
      setPopoverEvents([])
    } else {
      const eventsOnDay = events.filter((event) => {
        return format(parseISO(event.dayFrom), 'yyyy-MM-dd') === format(parseISO(dayId), 'yyyy-MM-dd')
      })
      setPopoverEvents(sortEventsByStartTime(eventsOnDay))
      setOpenPopoverDayId(dayId)
      const dateSelected = convertDateTimeToDate(dayId, "dd/MM/yyyy")
      const day = new Date(dayId)
      const dayOfWeek = format(day, "EEEE", { locale: vi })
      setSelectdDate({
        dateSelected,
        dayOfWeek,
      })
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        const isMoreButton = event.target.closest("[data-popover-button]")
        if (!isMoreButton) {
          setOpenPopoverDayId(null)
          setPopoverEvents([])
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full select-none">
          <div className="bg-white rounded-xl shadow text-[10px] sm:text-xs overflow-hidden relative">
            <div className="grid grid-cols-7 border-b font-semibold text-center text-gray-600">
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map((d, i) => (
                <div key={i} className="py-2 border-r last:border-r-0">{d}</div>
              ))}
            </div>
            <div className="relative" ref={calendarRef}>
              {/* DragOverlay: fix hiển thị overlay khi kéo từ calendar hoặc popover */}
              <DragOverlay adjustScale={false}>
                {draggedItem && draggedEventId && (
                  <div
                    style={{
                      borderLeftColor: draggedItem.colorMain,
                      backgroundColor: draggedItem.color,
                      height: "24px",
                      width: (() => {
                        const colWidth = calendarRef.current?.offsetWidth
                          ? calendarRef.current.offsetWidth / 7
                          : 100
                        return `${colWidth * (draggedEventDuration + 1)}px`
                      })(),
                      minWidth: "100px",
                    }}
                    className="flex items-center gap-1 px-1 py-[2px] truncate text-[12px] cursor-move border-l-2 rounded-md shadow"
                  >
                    <span className="font-semibold truncate w-full">{draggedItem.title}</span>
                    <div className="flex items-center justify-end gap-1 text-gray-600 min-w-[60px]">
                      <span className={`${draggedItem.icon["month"]?.color}`}>{draggedItem.icon["month"]?.content}</span>
                      <span className="whitespace-nowrap">{draggedItem.time?.split("-")[0]}</span>
                    </div>
                  </div>
                )}
              </DragOverlay>

              {calendar.map((week, weekIndex) => {
                const weekStart = week[0]
                const weeklyEvents = events.filter((event) => {
                  const from = parseISO(event.dayFrom)
                  const to = parseISO(event.dayTo)
                  return (
                    isWithinInterval(from, { start: week[0], end: week[6] }) ||
                    isWithinInterval(to, { start: week[0], end: week[6] }) ||
                    (from < week[0] && to > week[6])
                  )
                })
                const sortedWeeklyEvents = sortEventsByStartTime(weeklyEvents)
                const eventElements = []
                const globalRows = []
                const totalCols = 7
                const overflowPerDay = {}
                const eventsPerDay = {}
                week.forEach((date) => { eventsPerDay[format(date, "yyyy-MM-dd")] = [] })

                for (const event of sortedWeeklyEvents) {
                  // Ẩn event ở calendar nếu đang kéo chính nó (dù từ calendar hay popover)
                  if (
                    isDragging &&
                    draggedEventId &&
                    draggedEventId.replace(/^calendar-|^popover-/, "") === event.id
                  ) continue

                  const from = parseISO(event.dayFrom)
                  const to = parseISO(event.dayTo)
                  const startIdx = Math.max(0, differenceInCalendarDays(from, weekStart))
                  const endIdx = Math.min(6, differenceInCalendarDays(to, weekStart))
                  const eventDays = []
                  for (let i = startIdx; i <= endIdx; i++) eventDays.push(format(addDays(weekStart, i), "yyyy-MM-dd"))
                  const firstDayId = format(from, "yyyy-MM-dd")
                  if (eventsPerDay[firstDayId] && eventsPerDay[firstDayId].length >= MAX_VISIBLE_EVENTS) {
                    if (!overflowPerDay[firstDayId]) overflowPerDay[firstDayId] = []
                    overflowPerDay[firstDayId].push(event)
                    continue
                  }
                  let rowIndex = 0
                  while (true) {
                    if (!globalRows[rowIndex]) globalRows[rowIndex] = Array(totalCols).fill(false)
                    let hasConflict = false
                    for (let col = startIdx; col <= endIdx; col++) {
                      if (globalRows[rowIndex][col]) { hasConflict = true; break }
                    }
                    if (!hasConflict) break
                    rowIndex++
                  }
                  if (rowIndex >= MAX_VISIBLE_EVENTS) {
                    const dayId = format(from, "yyyy-MM-dd")
                    if (!overflowPerDay[dayId]) overflowPerDay[dayId] = []
                    overflowPerDay[dayId].push(event)
                    continue
                  }
                  for (let col = startIdx; col <= endIdx; col++) globalRows[rowIndex][col] = true
                  const isMultiDay = endIdx > startIdx
                  if (!isMultiDay) {
                    const dayId = format(from, "yyyy-MM-dd")
                    if (eventsPerDay[dayId]) eventsPerDay[dayId].push(event)
                  }
                  const colSpan = endIdx - startIdx + 1
                  const top = rowIndex * 24 + 2
                  const style = {
                    left: `calc(${(startIdx / 7) * 100}% + 2px)`,
                    width: `calc(${(colSpan / 7) * 100}% - 4px)`,
                    top,
                    height: `20px`,
                    zIndex: isDragging && draggedEventId === event.id ? 9999 : "auto",
                    backgroundColor: event.color,
                  }
                  const isDisabledForInnerDiv =
                    event.isCanceled ||
                    event.isLocked ||
                    event.typeUserJoin ||
                    (event.fromTime && isAfter(new Date(), parseISO(event.fromTime)));
                  eventElements.push(
                    <DraggableEvent key={`${event.id}-${rowIndex}`} event={{ ...event, top }} style={style}>
                      <div
                        data-id={event.id}
                        onClick={() => {
                          setIsOpenFormEventDetail(true)
                          setInfo({ id: event.id, title: event.title })
                        }}
                        style={{ borderLeftColor: event.colorMain }}
                        className={cn(
                          "flex items-center gap-1 px-1 py-[2px] w-full h-full truncate text-[12px] transition-all duration-200 ease-in-out border-l-2",
                          isDisabledForInnerDiv ? "cursor-pointer active:scale-[0.98] active:brightness-95" : "cursor-move active:scale-95", // Dùng cursor-default hoặc cursor-pointer nếu bạn muốn click được
                        )}
                      >
                        <span
                          className={cn(
                            "text-black font-semibold truncate w-full transition-colors duration-200",
                            isDragging && draggedEventId === event.id && "text-blue-700 font-bold",
                          )}
                        >
                          {event.title}
                        </span>
                        <div className="flex items-center justify-end gap-1 text-gray-600 min-w-[60px]">
                          <span className={`${event.icon["month"]?.color}`}> {event.icon["month"]?.content}</span>
                          <span className={cn("whitespace-nowrap transition-colors duration-200",
                            isDragging && draggedEventId === event.id && "text-blue-600 font-semibold",)}>
                            {event.time?.split("-")[0]}
                          </span>
                        </div>
                      </div>
                    </DraggableEvent>
                  )
                }

                const baseHeight = 24 + 8
                const rowCountForHeight = Math.min(globalRows.length, MAX_VISIBLE_EVENTS)
                const hasOverflowInWeek = Object.keys(overflowPerDay).length > 0
                const showMoreButtonHeight = hasOverflowInWeek ? 24 : 0
                const rowHeight = baseHeight + rowCountForHeight * 24 + showMoreButtonHeight

                return (
                  <div
                    key={weekIndex}
                    className="grid grid-cols-7 border-b relative"
                    style={{ minHeight: `${rowHeight}px` }}
                  >
                    {eventElements}
                    {week.map((date, i) => {
                      const isCurrent = isSameMonth(date, currentDate)
                      const isTodayDate = isToday(date) // Thêm dòng này để kiểm tra ngày hiện tại
                      const dateId = format(date, "yyyy-MM-dd")
                      const isDraggedOver = dragOverCell === dateId
                      const overflowEventsForDay = overflowPerDay[dateId] || []
                      const isPreviewCell = (() => {
                        if (!isDragging || !draggedEventId || typeof dragOverCell !== "string") return false
                        const startDate = parseISO(dragOverCell)
                        if (isNaN(startDate.getTime())) return false
                        for (let j = 0; j <= draggedEventDuration; j++) {
                          if (format(addDays(startDate, j), "yyyy-MM-dd") === dateId) return true
                        }
                        return false
                      })()

                      return (
                        <DroppableDay
                          key={i}
                          id={dateId}
                          data-id={dateId}
                          className={cn(
                            "relative p-1 pt-[2px] border-r last:border-r-0 min-h-[100px] transition-colors duration-200",
                            isCurrent ? "bg-white" : "bg-gray-200",
                            isDraggedOver && "bg-blue-100 border-blue-400",
                            isPreviewCell && "bg-blue-50 border-blue-300",
                          )}
                        >
                          {overflowEventsForDay.length > 0 && !isDragging && (
                            <>
                              <button
                                data-popover-button
                                className="absolute inset-x-1 text-left bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200 text-xs flex items-center justify-center p-1 z-10 rounded-lg"
                                style={{ top: `${MAX_VISIBLE_EVENTS * 24 + 2}px` }}
                                onClick={() => handleOpenPopover(dateId)} disabled={isDragging}
                              >
                                +{overflowEventsForDay.length} thêm
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </button>
                              {openPopoverDayId === dateId && (
                                <div
                                  ref={popoverRef}
                                  className="absolute z-[1000] bg-white border border-gray-300 px-2 pt-2 pb-3 shadow-sm rounded-lg flex flex-col"
                                  style={{
                                    // Place below for the very first row; otherwise place above
                                    ...(weekIndex === 0
                                      ? { top: "100%", transform: "translateX(-50%) translateY(-25px)" }   // below
                                      : { bottom: "100%", transform: "translateX(-50%) translateY(70px)" } // above
                                    ),
                                    left: "50%",
                                    minWidth: "220px",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="mb-1">
                                    <span className="text-sm font-semibold text-gray-600">
                                      {selectedDate?.dayOfWeek} {selectedDate?.dateSelected}
                                    </span>
                                  </div>
                                  <div
                                    className="space-y-1 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
                                    style={{
                                      maxHeight: "140px",
                                      overflowY: "auto",
                                    }}>
                                    {popoverEvents.map((event) => {
                                      if (
                                        isDragging &&
                                        draggedEventId &&
                                        draggedEventId.replace(/^calendar-|^popover-/, "") === event.id
                                      ) return null
                                      const isDisabledForInnerDiv =
                                        event.isCanceled ||
                                        event.isLocked ||
                                        event.typeUserJoin ||
                                        (event.fromTime && isAfter(new Date(), parseISO(event.fromTime)));
                                      return (
                                        <PopoverDraggableEvent key={event.id} event={event}>
                                          <div
                                            onClick={() => {
                                              setIsOpenFormEventDetail(true)
                                              setInfo({ id: event.id, title: event.title })
                                              setOpenPopoverDayId(null)
                                            }}
                                            style={{ borderLeftColor: event.colorMain, backgroundColor: event.color }}
                                            className={cn(
                                              "flex items-center justify-between gap-1 px-1 py-[2px] w-full truncate text-[12px] transition-colors duration-200 border-l-2 hover:bg-gray-100",
                                              isDisabledForInnerDiv ? "cursor-pointer active:scale-[0.98] active:brightness-95" : "cursor-move" // Tương tự, dùng cursor-pointer nếu muốn click được
                                            )}
                                          >
                                            <span className="font-semibold truncate block max-w-[180px]">
                                              {event.title}
                                            </span>

                                            <div className="flex items-center justify-end gap-1 text-gray-600 min-w-[60px]">
                                              <span className={`${event.icon["month"]?.color}`}>{event.icon["month"]?.content}</span>
                                              <span className="whitespace-nowrap transition-colors duration-200">
                                                {event.time?.split("-")[0]}
                                              </span>
                                            </div>
                                          </div>
                                        </PopoverDraggableEvent>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                          <span
                            className={cn(
                              "absolute bottom-1 left-1 text-xs z-10 pointer-events-none w-5 h-5 flex items-center justify-center rounded-full",
                              isCurrent ? "text-gray-500" : "text-gray-400",
                              isTodayDate && "bg-blue-500 text-white font-semibold", // Đổi màu nền cho ngày hiện tại
                            )}
                          >
                            {date.getDate()}
                          </span>
                        </DroppableDay>
                      )
                    })}

                  </div>
                )
              })}
            </div>
            {isDragging && <div className="absolute inset-0 pointer-events-none z-50 border-2 border-blue-300 rounded-xl" />}
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

      {isOpenFormEventDetail && (
        <EventDetail
          isOpen={isOpenFormEventDetail}
          onClose={() => {
            clearId()
            setIsOpenFormEventDetail(false)
          }}
          info={info}
          view={CalendarConstants.viewType[CalendarConstants.views.Month]}
        />
      )}
    </>
  )
}