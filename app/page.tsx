import "@/styling/globals.scss"

import styles from "./page.module.scss"

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import * as React from "react"

const Home = async () => {
  return <main className={styles.main}></main>
}

export const dynamic = "force-dynamic"
export default Home
