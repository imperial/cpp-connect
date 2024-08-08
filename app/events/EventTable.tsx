"use client"

import TanstackTable from "@/components/TanstackTable"

import type { CompanyProfile, Event } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { format, getDate, intlFormat } from "date-fns"

type EventRow = {
  company: CompanyProfile
} & Event

const columnHelper = createColumnHelper<EventRow>()

const EventTable = ({ events, hideCompanyName = false }: { events: EventRow[]; hideCompanyName?: boolean }) => {
  const columns = [
    columnHelper.accessor("company.name", {
      cell: info => info.getValue(),
      header: "Company",
      id: "company.name",
      sortingFn: "alphanumeric",
      enableColumnFilter: !hideCompanyName,
    }),

    columnHelper.accessor("title", {
      cell: info => info.getValue(),
      header: "Title",
      sortingFn: "alphanumeric",
      id: "title",
    }),

    columnHelper.accessor("dateStart", {
      cell: info => <time suppressHydrationWarning={true}>{format(info.getValue(), "eeee, MMMM eo 'at' HH:mm ")}</time>,
      header: "Start Date",
      sortingFn: "datetime",
      id: "dateStart",
      enableColumnFilter: false,
    }),

    columnHelper.accessor("shortDescription", {
      cell: info => info.getValue(),
      header: "Description",
      sortingFn: "text",
      id: "shortDescription",
    }),

    columnHelper.accessor("location", {
      cell: info => info.getValue(),
      header: "Location",
      sortingFn: "text",
      id: "location",
    }),

    columnHelper.accessor("spaces", {
      cell: info => info.getValue(),
      header: "Spaces",
      sortingFn: "alphanumeric",
      id: "spaces",
      enableColumnFilter: false,
    }),
  ]

  return <TanstackTable data={events} columns={columns} columnVisibility={{ "company.name": !hideCompanyName }} />
}

export default EventTable
