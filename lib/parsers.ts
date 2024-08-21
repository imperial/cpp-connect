import { FormFieldParser } from "@/lib/types"

export const stringParser: FormFieldParser<string> = (rawData: FormDataEntryValue): string => {
  return rawData.toString().trim()
}
