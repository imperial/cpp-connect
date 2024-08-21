import { TIMEZONE } from "@/lib/constants"

import { fromZonedTime } from "date-fns-tz"

export const parseDateTime = (rawDate: FormDataEntryValue | null): Date | null => {
  if (!rawDate) {
    return null
  }
  const date = new Date(rawDate.toString().trim())
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null
  }
  return fromZonedTime(date, TIMEZONE)
}
