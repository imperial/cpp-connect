"use client"

import { TIMEZONE } from "@/lib/constants"

import styles from "./datetime-picker.module.scss"

import { TextField } from "@radix-ui/themes"
import { format } from "date-fns"
import { toZonedTime } from "date-fns-tz"

const DateTimePicker = ({
  name,
  placeholder,
  required = false,
  defaultDate,
  onChange,
}: {
  name: string
  placeholder: string
  required?: boolean
  defaultDate?: Date | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <TextField.Root
      className={styles.inputBox}
      type="datetime-local"
      name={name}
      placeholder={placeholder}
      required={required}
      defaultValue={!!defaultDate ? format(toZonedTime(defaultDate, TIMEZONE), "yyyy-MM-dd'T'HH:mm") : ""}
      onChange={onChange}
    />
  )
}

export default DateTimePicker
