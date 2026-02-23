import moment from "moment";

const IST_OFFSET = "+05:30";

function toIST(date: string | Date): moment.Moment {
  return moment(date).utcOffset(IST_OFFSET);
}

export function formatDate(date: string | Date): string {
  return toIST(date).format("MMM D, YYYY");
}

export function formatDateTime(date: string | Date): string {
  return toIST(date).format("MMM D, YYYY, h:mm A");
}

export function formatTime(date: string | Date): string {
  return toIST(date).format("h:mm A");
}

export function formatDateLong(date: string | Date): string {
  return toIST(date).format("MMMM D, YYYY");
}

export function formatDateShort(date: string | Date): string {
  return toIST(date).format("MMM D");
}

export function formatDateNumeric(date: string | Date): string {
  return toIST(date).format("DD/MM/YYYY");
}

export function formatRelative(date: string | Date): string {
  return moment(date).fromNow();
}

export function formatMonthYear(date: string | Date): string {
  return toIST(date).format("MMMM YYYY");
}

export function formatDayMonth(date: string | Date): string {
  return toIST(date).format("D MMM");
}

export function formatFullDateTime(date: string | Date): string {
  return toIST(date).format("DD MMM YYYY, h:mm:ss A");
}

export function formatDateWithDay(date: string | Date): string {
  return toIST(date).format("ddd, MMM D, YYYY");
}

export function formatTimeShort(date: string | Date): string {
  return toIST(date).format("hh:mm A");
}

export function formatDateGroupLabel(date: string | Date): string {
  const istDate = toIST(date);
  const today = moment().utcOffset(IST_OFFSET).startOf("day");
  const yesterday = moment().utcOffset(IST_OFFSET).subtract(1, "day").startOf("day");

  if (istDate.isSame(today, "day")) return "Today";
  if (istDate.isSame(yesterday, "day")) return "Yesterday";
  return istDate.format("MMMM D, YYYY");
}