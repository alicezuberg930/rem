import type { CSSProperties, ReactNode } from 'react'
import { isAfter } from 'date-fns'
import {
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from './types'
import { getEventRange } from './utils'

export const useCalendar = () => {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  )

  const DraggableEvent = ({
    event,
    children,
    className,
    style,
  }: {
    event: CalendarEvent
    children: ReactNode
    className?: string
    style?: CSSProperties
  }) => {
    const { startsAt } = getEventRange(event)
    const disabled = isAfter(new Date(), startsAt)
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: event.id,
      disabled,
    })

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={{
          ...style,
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          touchAction: 'none',
        }}
        className={cn(
          disabled ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing',
          className
        )}
      >
        {children}
      </div>
    )
  }

  const DroppableDay = ({
    children,
    id,
    className,
    style,
  }: {
    children: ReactNode
    id: string
    className?: string
    style?: CSSProperties
  }) => {
    const { setNodeRef } = useDroppable({ id })

    return (
      <div ref={setNodeRef} id={id} className={className} style={style}>
        {children}
      </div>
    )
  }

  return {
    sensors,
    DraggableEvent,
    DroppableDay,
  }
}
