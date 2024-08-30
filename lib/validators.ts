import { FormValidator } from "@/lib/types"

/**
 * @param url - a string to be validated
 * @return a string with an error message if validation failed or null if validation succeeded
 */
export const urlValidator: FormValidator<string | null> = (url: string | null): string | null => {
  if (url === null) {
    return null
  }
  try {
    new URL(url)
    return null
  } catch (_) {
    return "Invalid URL."
  }
}

/**
 * @param slug - the slug to be validated
 * @return a string with an error message if validation failed or null if validation succeeded
 */
export const slugValidator: FormValidator<string | null> = (slug: string | null): string | null => {
  if (slug === null) {
    return null
  }
  if (!slug.match(/^[a-z0-9\-]+$/)) {
    return "Invalid characters in slug. Only lowercase alphanumeric characters and hyphens are allowed."
  }
  return null
}
