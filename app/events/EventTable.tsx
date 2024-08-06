"use client"

import TanstackTable from "@/components/TanstackTable"

import type { CompanyProfile, Event } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { format, getDate, intlFormat } from "date-fns"

type EventRow = {
  company: CompanyProfile
} & Event

const columnHelper = createColumnHelper<EventRow>()

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
    cell: info => <time suppressHydrationWarning={true}>{format(info.getValue(), "eeee, MMMM eo 'at' HH:mm ")}</time>,
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
