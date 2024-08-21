import { stringParser } from "@/lib/parsers"
import { FormConfig, FormFieldParser } from "@/lib/types"

function processForm<T>(formData: FormData, config: FormConfig<T>): T {
  const processedData = {} as T
  // get keys of T
  const keys = Object.keys(config) as Array<keyof T>
  for (let key of keys) {
    const field = config[key]
    const formEntry = formData.get(key.toString())
    if (formEntry === null) {
      if (field?.optional) {
        continue
      } else {
        throw new Error(`${key.toString()} is required.`)
      }
    }
    // if parser is not provided, assume the field is a string and use stringParser
    const parser = field?.parser ?? (stringParser as FormFieldParser<T[keyof T]>)
    const value = parser(formEntry)
    for (let validator of field?.validators ?? []) {
      const errorMsg = validator(value)
      if (!!errorMsg) {
        throw new Error(errorMsg)
      }
    }
    processedData[key] = value
  }
  return processedData
}
