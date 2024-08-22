export interface FormPassBackState {
  message: string
  status: "success" | "error"
}

export type ServerSideFormHandler<
  T extends FormPassBackState = FormPassBackState,
  Args extends unknown[] = unknown[],
> = (prevState: T, formData: FormData, ...args: Args) => Promise<T>

export type ServerActionDecorator<T extends FormPassBackState, Args extends unknown[]> = (
  action: ServerSideFormHandler<T, Args>,
) => ServerSideFormHandler<T, Args>

export enum FileCategory {
  IMAGE,
  DOCUMENT,
}

export type FormFieldParser<T> = (rawData: FormDataEntryValue) => T

/**
 * @returns a string with an error message if fails and null if succeeds
 */
export type FormValidator<T> = (value: T) => string | null

/**
 * Configuration object for parsing a singular form field
 */
export interface FormField<T> {
  parser?: FormFieldParser<T>
  optional?: boolean
  validators?: Array<FormValidator<T>>
}

/**
 * Wraps the type of each field in a FormField (where the type is a generic for it)
 */
export type FormConfig<T> = {
  [K in keyof T]: FormField<T[K]>
}
