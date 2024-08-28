import { TIMEZONE } from "@/lib/constants"
import { FormFieldParser } from "@/lib/types"

import { OpportunityType } from "@prisma/client"
import { fromZonedTime } from "date-fns-tz"

export const parseString: FormFieldParser<string> = (rawData: FormDataEntryValue): string => {
  const res = rawData.toString().trim()
  if (!!res) {
    return res
  }
  throw new Error("Parsing error. Given value is empty.")
}

/**
 * The function returns a Date object but as it doesn't contain tz information, we add an appropriate
 * offset according to the TIMEZONE variable
 * @param rawDate - a raw date that comes from FormData
 */
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

export const parseOpportunityType: FormFieldParser<OpportunityType> = (
  rawType: FormDataEntryValue,
): OpportunityType => {
  const type = parseString(rawType)
  if (!Object.keys(OpportunityType).includes(type)) {
    throw new Error("Parsing error. The provided type of opportunity does not exist.")
  }
  return type as OpportunityType
}
