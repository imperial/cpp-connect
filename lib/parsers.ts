import { TIMEZONE } from "@/lib/constants"
import { FormFieldParser } from "@/lib/types"

import { fromZonedTime } from "date-fns-tz"

export const stringParser: FormFieldParser<string> = (rawData: FormDataEntryValue): string => {
  return rawData.toString().trim()
}

export const parseDateTime: FormFieldParser<Date> = (rawDate: FormDataEntryValue): Date => {
  const date = new Date(rawDate.toString().trim())
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Parsing error. Invalid datetime format.")
  }
  return fromZonedTime(date, TIMEZONE)
}

export const parseNonNegativeInt: FormFieldParser<number> = (rawNum: FormDataEntryValue): number => {
  const num = parseInt(rawNum.toString().trim())
  if (isNaN(num) || num < 0) {
    throw new Error("Parsing error. Number must be a non-negative integer.")
  }
  return num
}
