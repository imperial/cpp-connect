import { FormValidator } from "@/lib/types"

/**
 * @param value - a string to be validated
 * @return a string with an error message if validation failed or null if validation succeeded
 */
export const urlValidator: FormValidator<string> = (value: string): string | null => {
  try {
    new URL(value)
    return null
  } catch (_) {
    return "Invalid URL."
  }
}

/**
 * @param value - a string to be validated
 * @return a string with an error message if validation failed or null if validation succeeded
 */
export const slugValidator: FormValidator<string> = (slug: string): string | null => {
  if (!slug.match(/^[a-z0-9\-]+$/)) {
    return "Invalid characters in slug. Only lowercase alphanumeric characters and hyphens are allowed."
  }
  return null
}
