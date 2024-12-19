/**
 * Make a number pretty by adding commas
 * @param num
 * @returns
 */
export function makePrettyNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
