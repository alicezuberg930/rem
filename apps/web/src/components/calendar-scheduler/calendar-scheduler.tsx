// import { CalendarCheck, SquareArrowLeft, SquareArrowRight } from "lucide-react";
// import { CalendarProvider } from "./calendar-provider"
// import { useState } from "react";
// import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks, startOfDay } from "date-fns";
// import { DayView } from "./views/day-view";
// import { WeekView } from "./views/week-view";
// import { MonthView } from "./views/month-view";
// import { options, View } from "./types";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { CalendarDatePicker } from "./calendar-date-picker";
// import { Button } from "../ui/button";
// import { cn } from "@/lib/utils";

// function getCurrentWeek(weekStart = "monday") {
//     const today = new Date()
//     const startDay = weekStart === "monday" ? 1 : 0
//     const startOfWeek = new Date(today)
//     while (startOfWeek.getDay() !== startDay) {
//         startOfWeek.setDate(startOfWeek.getDate() - 1)
//     }
//     startOfWeek.setHours(0, 0, 0, 0)
//     const endOfWeek = new Date(startOfWeek)
//     endOfWeek.setDate(startOfWeek.getDate() + 6)
//     endOfWeek.setHours(23, 59, 59, 999)
//     return { from: startOfWeek, to: endOfWeek }
// }

// export const CalendarScheduler = () => {
//     const [view, setView] = useState<View>('month');
//     const [selectDate, setSelectDate] = useState(new Date());
//     const [selectDateWeek, setSelectDateWeek] = useState(getCurrentWeek('monday'));

//     const handlePrev = () => {
//         switch (view) {
//             case 'day':
//                 setSelectDate(prev => subDays(prev, 1))
//                 break;
//             case 'week':
//                 setSelectDateWeek(prev => {
//                     if (!prev.from || !prev.to) return prev;
//                     const newFrom = subWeeks(prev.from, 1)
//                     newFrom.setHours(0, 0, 0, 0)
//                     const newTo = new Date(newFrom)
//                     newTo.setDate(newFrom.getDate() + 6)
//                     newTo.setHours(23, 59, 59, 999)
//                     return { from: newFrom, to: newTo }
//                 })
//                 break;
//             case 'month':
//                 setSelectDate(prev => subMonths(prev, 1))
//                 break;
//         }
//     }

//     const handleNext = () => {
//         switch (view) {
//             case 'day':
//                 setSelectDate(prev => addDays(prev, 1))
//                 break;
//             case 'week':
//                 setSelectDateWeek(prev => {
//                     if (!prev.from || !prev.to) return prev;
//                     const newFrom = addWeeks(prev.from, 1)
//                     newFrom.setHours(0, 0, 0, 0)
//                     const newTo = new Date(newFrom)
//                     newTo.setDate(newFrom.getDate() + 6)
//                     newTo.setHours(23, 59, 59, 999)
//                     return { from: newFrom, to: newTo }
//                 })
//                 break;
//             case 'month':
//                 setSelectDate(prev => addMonths(prev, 1))
//                 break;
//         }
//     }

//     const today = startOfDay(new Date());

//     let isCurrentDateSelected = false;

//     if (view === 'week') {
//         if (selectDateWeek.from && selectDateWeek.to) {
//             const fromTime = selectDateWeek.from.getTime();
//             const toTime = selectDateWeek.to.getTime();
//             const todayTime = today.getTime();
//             isCurrentDateSelected = todayTime >= fromTime && todayTime <= toTime;
//         }
//     } else {
//         isCurrentDateSelected = selectDate && startOfDay(selectDate).getTime() === today.getTime();
//     }

//     return (
//         <div className="relative rounded-lg shadow-sm p-6">
//             {/* filter bar for modes */}
//             <div className="bg-white p-4 border-b rounded-xl mb-5">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                     {/* today, Date, Prev/Next, 3 Mode View */}
//                     <div className="flex flex-wrap gap-3 items-center">
//                         {/* today */}
//                         <Button
//                             variant="outline"
//                             className={cn(
//                                 "h-10",
//                                 isCurrentDateSelected ? ' text-blue-500 border-blue-300' : 'text-gray-600'
//                             )}
//                             onClick={() => {
//                                 if (view === 'week') {
//                                     setSelectDateWeek(getCurrentWeek('monday'));
//                                 } else {
//                                     setSelectDate(new Date());
//                                 }
//                             }}
//                         >
//                             <CalendarCheck className="w-4 h-4" />
//                             Hôm nay
//                         </Button>

//                         {/* view mode */}
//                         <Select
//                             value={view}
//                             onValueChange={(value) => {
//                                 if (value !== null) setView(value as View)
//                             }}
//                         >
//                             <SelectTrigger className='w-full'>
//                                 <SelectValue placeholder='Select image size' />
//                             </SelectTrigger>
//                             <SelectContent align='start' className='max-h-72'>
//                                 {Object.entries(options).map(([key, option]) => (
//                                     <SelectItem key={key} value={key}>
//                                         {option}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>

//                         {/* Date Picker */}
//                         <div className="w-[170px] sm:w-[200px]">
//                             {view !== 'week' ? (
//                                 <CalendarDatePicker mode={view} onChange={(e) => setSelectDate(e as Date)} value={selectDate} />
//                             ) : (
//                                 <CalendarDatePicker mode="week" onChange={(e) => setSelectDateWeek(e as { from: Date; to: Date })} value={selectDateWeek} />
//                             )}
//                         </div>

//                         {/* next and previous navigation */}
//                         <div className="flex gap-1 items-center">
//                             <Button
//                                 variant="outline"
//                                 onClick={handlePrev}
//                                 className="bg-gray-100 px-2 rounded hover:bg-blue-50"
//                             >
//                                 <SquareArrowLeft className="text-gray-600" size={24} />
//                             </Button>
//                             <Button
//                                 variant="outline"
//                                 onClick={handleNext}
//                                 className="bg-gray-100 px-2 rounded hover:bg-blue-50"
//                             >
//                                 <SquareArrowRight className="text-gray-600" size={24} />
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* calendar view */}
//             <CalendarProvider>
//                 <div className="overflow-x-auto w-full">
//                     <div className="w-full">
//                         {view === 'day' ? (
//                             <DayView date={selectDate} type={type} view={view} />
//                         ) : view === 'week' ? (
//                             <WeekView fromDate={selectDateWeek.from} toDate={selectDateWeek.to} type={type} view={view} />
//                         ) : view === 'month' ? (
//                             <MonthView date={selectDate} type={type} view={view} />
//                         ) : null}
//                     </div>
//                 </div>
//             </CalendarProvider>
//         </div>
//     );
// }