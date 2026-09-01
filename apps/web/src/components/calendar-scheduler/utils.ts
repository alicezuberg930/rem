import { format } from "date-fns";

export const parseTimeToMinutes = (time: string) => { // đổi thời gian bắt đầu cho calendar
    if (!time) return 0
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

export const getTopOffset = (time: string) => { // đổi thời gian kết thúc cho calendar
    if (!time) return 0
    const [start] = time.split(' - ');
    const minutes = parseTimeToMinutes(start);
    const ratio = 960 / (24 * 60);
    return minutes * ratio;
}

export const convertDateTimeToDate = (datetimeStr: string, type = "yyyy-MM-dd") => {
    if (!datetimeStr) return
    const rawDate = new Date(datetimeStr);
    const formatted = format(rawDate, type);
    return formatted
}

export const parseTextToParts = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts
        .filter(p => p.trim() !== "") // loại bỏ khoảng trắng dư
        .map(part => ({
            content: part,
            isLink: /^https?:\/\//.test(part) // true nếu là linkstring
        }));
}

export const formatDateLocal = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const convertDateTimeToDateAndTimeByType = (dateStr: string, type = "dd-MM-yyyy") => {
    const [dateConvert, time] = dateStr.split('T');
    const timeWithoutSeconds = time.slice(0, 5);
    const date = format(dateConvert, type);
    return {
        date,
        timeWithoutSeconds
    }
}

export const convertDateTimeToDateAndTime = (dateStr: string) => {
    const [date, time] = dateStr.split('T');
    const timeWithoutSeconds = time.slice(0, 5);
    return {
        date,
        timeWithoutSeconds
    }
}