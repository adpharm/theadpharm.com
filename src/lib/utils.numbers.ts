/**
 * Make a number pretty by adding commas
 * @param num
 * @returns
 */
export function makePrettyNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Take Seconds and convert it to a human readable format
 * @param seconds
 * @returns string
 */
export function convertSecondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours} hours ${minutes} minutes`;
}
