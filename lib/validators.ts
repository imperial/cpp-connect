import { FormValidator } from "@/lib/types"

export const urlValidator: FormValidator<string> = (value: string): string | null => {
  try {
    new URL(value)
    return null
  } catch (_) {
    return "Invalid URL."
  }
}

export const slugValidator: FormValidator<string> = (slug: string): string | null => {
  if (!slug.match(/^[a-z0-9\-]+$/)) {
    return "Invalid characters in slug. Only lowercase alphanumeric characters and hyphens are allowed."
  }
  return null
}
