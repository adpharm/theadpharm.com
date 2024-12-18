import { format, formatDistanceToNow } from "date-fns";

/**
 * Convert a UTC datetime string to the local time
 *
 * @param utcDateStr
 * @param formatStr
 * @returns
 */
export function convertUTCToLocalTime(
  utcDateStr: string,
  formatStr: string = "PPp",
): string {
  // Parse the UTC datetime string
  const utcDate = new Date(utcDateStr + "Z"); // Adding 'Z' to ensure it's treated as UTC

  // Format the date to the local time
  const localDateStr = format(utcDate, formatStr);

  return localDateStr;
}

/**
 *
 * @param utcDateStr
 * @returns "x minutes ago" or "x hours ago" or "x days ago" etc.
 */
export function convertUTCToDistanceToNow(utcDateStr: string): string {
  // Parse the UTC datetime string
  const utcDate = new Date(utcDateStr + "Z"); // Adding 'Z' to ensure it's treated as UTC

  // Format the date to the local time
  const distanceToNow = formatDistanceToNow(utcDate, { addSuffix: true });

  return distanceToNow;
}
