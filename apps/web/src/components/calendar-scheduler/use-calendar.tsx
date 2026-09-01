import {
    MouseSensor,
    TouchSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { isAfter, parseISO } from "date-fns";
import { CalendarEvent } from "./types";
import { cn } from "@/lib/utils";

export const useCalendar = () => {
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        })
    );

    // DraggableEvent cho cả Week và Month
    const DraggableEvent = ({ event, children, style }: { event: CalendarEvent; children: React.ReactNode; style?: React.CSSProperties }) => {
        const disabled = isAfter(new Date(), parseISO(event.fromTime));
        const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: event.id, disabled });
        const transformedStyle = {
            ...style,
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            zIndex: 20,
            touchAction: "none",
        };

        return (
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                style={transformedStyle}
                className={cn(
                    "absolute px-1 py-[2px] rounded text-[10px] sm:text-xs",
                    event.color,
                    disabled ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
                )}
            >
                {children}
            </div>
        );
    }

    // DroppableDay để wrap vùng nhận drop
    const DroppableDay = ({ children, id, className }: { children: React.ReactNode; id: string; className?: string }) => {
        const { setNodeRef } = useDroppable({ id });
        return (
            <div ref={setNodeRef} id={id} className={className}>
                {children}
            </div>
        );
    }

    const formatToDateTime = ({ dayFrom, dayTo, time }: { dayFrom: string; dayTo: string; time: string }) => {
        const [start, end] = time.split(" - ");
        return {
            fromTime: `${dayFrom}T${start}:00`,
            toTime: `${dayTo}T${end}:00`,
        };
    }

    return {
        sensors,
        DraggableEvent,
        DroppableDay,
        formatToDateTime,
    };
}