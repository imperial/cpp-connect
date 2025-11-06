// October is designated as the cut-off month
const ROLLOVER_MONTH = 9

/**
 * Returns the current academic year as a short string using today's date
 * The rollover month (i.e. using previous or future year) is a constant, set to October.
 * e.g. 12 Sep 2023 -> '2324', 6 Oct 2025 -> 2526
 *
 * @returns {string} The short year string.
 */
export function currentShortYear(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const [curr, prev, next] = [year, year - 1, year + 1].map(y => `${y}`.slice(2))
  return month < ROLLOVER_MONTH ? `${prev}${curr}` : `${curr}${next}`
}
