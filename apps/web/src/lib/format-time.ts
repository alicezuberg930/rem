import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type InputValue = Date | string | number | null;

export function fDate(date: InputValue, newFormat: string = 'DD MMM YYYY') {
  return date ? dayjs(date).format(newFormat) : '';
}

export function fDateTime(date: InputValue, newFormat: string = 'DD MMM YYYY h:mm A') {
  return date ? dayjs(date).format(newFormat) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? dayjs(date).valueOf() : '';
}

export function fToNow(date: InputValue) {
  return date ? dayjs(date).toNow() : '';
}
