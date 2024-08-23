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
  showTime = true,
  value,
}: {
  name: string
  placeholder: string
  required?: boolean
  defaultDate?: Date | null
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  showTime?: boolean
  value?: string
}) => {
  return (
    <TextField.Root
      className={styles.inputBox}
      type={showTime ? "datetime-local" : "date"}
      name={name}
      placeholder={placeholder}
      required={required}
      defaultValue={
        !!defaultDate ? format(toZonedTime(defaultDate, TIMEZONE), showTime ? "yyyy-MM-dd'T'HH:mm" : "yyyy-MM-dd") : ""
      }
      onChange={onChange}
      value={value}
    />
  )
}

export default DateTimePicker
