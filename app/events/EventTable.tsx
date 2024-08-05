"use client"

import TanstackTable from "@/components/TanstackTable"

import type { CompanyProfile, Event } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format, formatDistanceToNowStrict, getDate, intlFormat } from "date-fns"

type EventRow = {
  company: CompanyProfile
} & Event

const columnHelper = createColumnHelper<EventRow>()

const getDateSuffix = (date: number): string => {
  if (date === 1 || date === 21 || date === 31) {
    return "st"
  } else if (date === 2 || date === 22) {
    return "nd"
  } else if (date === 3 || date === 23) {
    return "rd"
  } else {
    return "th"
  }
}

const formatDate = (date: Date): string => {
  const day = format(date, "EEEE")
  const dateNum = getDate(date)
  const month = format(date, "MMMM")
  const hours = format(date, "HH")
  const minutes = format(date, "mm")
  const dateSuffix = getDateSuffix(dateNum)

  return `${day} ${dateNum}${dateSuffix} ${month} ${hours}:${minutes}`
}

const columns = [
  columnHelper.accessor("company.name", {
    cell: info => info.getValue(),
    header: "Company",
    id: "company.name",
    sortingFn: "alphanumeric",
  }),

  columnHelper.accessor("title", {
    cell: info => info.getValue(),
    header: "Title",
    sortingFn: "alphanumeric",
  }),

  columnHelper.accessor("dateStart", {
    cell: info => <time suppressHydrationWarning={true}>{formatDate(info.getValue())}</time>,
    header: "Start Date",
    sortingFn: "datetime",
  }),

  columnHelper.accessor("shortDescription", {
    cell: info => info.getValue(),
    header: "Description",
    sortingFn: "text",
  }),

  columnHelper.accessor("location", {
    cell: info => info.getValue(),
    header: "Location",
    sortingFn: "text",
  }),

  columnHelper.accessor("spaces", {
    cell: info => info.getValue(),
    header: "Spaces",
    sortingFn: "alphanumeric",
  }),
]

const EventTable = ({ events }: { events: EventRow[] }) => {
  return <TanstackTable data={events} columns={columns} />
}

export default EventTable
