import { format, formatDistanceToNow } from "date-fns";
import { logError } from "./utils.logger";

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
  try {
    // Parse the UTC datetime string
    const utcDate = new Date(utcDateStr + "Z"); // Adding 'Z' to ensure it's treated as UTC

    // Format the date to the local time
    const localDateStr = format(utcDate, formatStr);

    return localDateStr;
  } catch (error) {
    logError("Error converting UTC to local time", error);
    return utcDateStr;
  }
}

/**
 *
 * @param utcDateStr
 * @returns "x minutes ago" or "x hours ago" or "x days ago" etc.
 */
export function convertUTCToDistanceToNow(utcDateStr: string): string {
  try {
    // Parse the UTC datetime string
    const utcDate = new Date(utcDateStr + "Z"); // Adding 'Z' to ensure it's treated as UTC

    // Format the date to the local time
    const distanceToNow = formatDistanceToNow(utcDate, { addSuffix: true });

    return distanceToNow;
  } catch (error) {
    logError("Error converting UTC to distance to now", error);
    return utcDateStr;
  }
}
