"use client"

import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"

import type { CompanyProfile, Event } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"

type EventRow = {
  company: CompanyProfile
} & Event

const columnHelper = createColumnHelper<EventRow>()

type ColumnName = keyof EventRow | `company.${keyof CompanyProfile}`

const EventTable = ({
  events,
  columns,
  nonFilterable = [],
}: {
  events: EventRow[]
  columns: ColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const columnDefsMap: Partial<Record<ColumnName, ColumnDef<EventRow, any>>> = {
    "company.name": {
      cell: info => <Link href={`/companies/${info.row.original.company.name}`}>{info.getValue()}</Link>,
      header: "Company",
      id: "company.name",
      sortingFn: "alphanumeric",
    },
    title: {
      cell: info => <Link href={`/events/${info.row.original.id}`}>{info.getValue()}</Link>,
      header: "Title",
      sortingFn: "alphanumeric",
      id: "title",
    },
    dateStart: {
      cell: info => <time suppressHydrationWarning={true}>{format(info.getValue(), "eeee, MMMM eo 'at' HH:mm ")}</time>,
      header: "Start Date",
      sortingFn: "datetime",
      id: "dateStart",
      enableColumnFilter: false,
    },
    shortDescription: {
      cell: info => info.getValue(),
      header: "Description",
      sortingFn: "text",
      id: "shortDescription",
    },
    location: {
      cell: info => info.getValue(),
      header: "Location",
      sortingFn: "text",
      id: "location",
    },
    spaces: {
      cell: info => info.getValue(),
      header: "Spaces",
      sortingFn: "alphanumeric",
      id: "spaces",
      enableColumnFilter: false,
    },
  }

  for (let column of nonFilterable) {
    if (columnDefsMap[column]) {
      columnDefsMap[column]!.enableColumnFilter = false
    }
  }

  const columnDefs = columns.map((columnName: ColumnName) =>
    columnHelper.accessor(
      columnName,
      columnDefsMap[columnName] ?? {
        // default column definition, so that all company values are also accessible
        cell: info => info.getValue(),
        header: columnName,
        sortingFn: "alphanumeric",
        id: columnName,
        enableColumnFilter: !(columnName in nonFilterable),
      },
    ),
  )

  return <TanstackTable data={events} columns={columnDefs} />
}

export default EventTable
