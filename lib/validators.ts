import { FormValidator } from "@/lib/types"

export const urlValidator: FormValidator<string> = (value: string): string | null => {
  try {
    new URL(value)
    return null
  } catch (_) {
    return "Invalid URL."
  }
}
