import { parseString } from "@/lib/parsers"
import { FormConfig, FormFieldParser } from "@/lib/types"

/**
 * @param formData the standard FormData object passed to form handlers
 * @param config form config containing whether the field is required, a parser function,
 *               and validator functions
 * @returns a well formed object that can be passed to an upsert prisma method
 * @description Loops through the objects in the config and deconstructs the submitted
 *              form. Using the configuration, parse the form data and throw errors
 *              if a required type is missing or any field is malformed. Also run
 *              additional list of validators on each field specified by config.
 * @example
 *   const formConfigUserCreate: FormConfig<{email: string, baseUrl: string}> = {
 *     email: {optional: true, validators: [someValidator]},
 *     baseUrl: {},
 *   }
 *
 *   try {
 *     parsedThing = processForm(formData, formConfigCreate)
 *   } catch (e: any) {
 *     return { message: e.message, status: "error" }
 *   }
 */
export function processForm<T>(formData: FormData, config: FormConfig<T>): T {
  const processedData = {} as Partial<T>
  // get keys of T
  const keys = Object.keys(config) as Array<keyof T>
  for (let key of keys) {
    const field = config[key]
    const formEntry = formData.get(key.toString())
    if (!formEntry) {
      if (field?.optional) {
        processedData[key] = null as any
        continue
      } else {
        throw new Error(`${key.toString()} is required.`)
      }
    }
    // if parser is not provided, assume the field is a string and use stringParser
    const parser = field?.parser ?? (parseString as FormFieldParser<T[keyof T]>)
    const value = parser(formEntry)
    for (let validator of field?.validators ?? []) {
      const errorMsg = validator(value)
      if (!!errorMsg) {
        throw new Error(errorMsg)
      }
    }
    processedData[key] = value
  }
  return processedData as T
}
