"use client"
import { createContext, useContext, useState, useCallback } from "react";
import { CalendarContextType, View } from "./types";

const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
    const [reloadKey, setReloadKey] = useState<Record<View, number>>({
        day: 0,
        week: 0,
        month: 0,
    });

    const triggerReload = useCallback((view: View) => {
        setReloadKey((prev) => ({
            ...prev,
            [view]: prev[view] + 1,
        }));
    }, []);

    return (
        <CalendarContext.Provider value={{ reloadKey, triggerReload }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => useContext(CalendarContext);
