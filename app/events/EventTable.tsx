"use client"

import TanstackTable from "@/components/TanstackTable"

import type { CompanyProfile, Event } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format, getDate, intlFormat } from "date-fns"

type EventRow = {
  company: CompanyProfile
} & Event

const columnHelper = createColumnHelper<EventRow>()

type ColumnName =
  | "link"
  | "id"
  | "companyID"
  | "title"
  | "dateStart"
  | "dateEnd"
  | "shortDescription"
  | "richSummary"
  | "spaces"
  | "location"
  | "createdAt"
  | "updatedAt"
  | "company.name"

const EventTable = ({
  events,
  keptColumns,
  nonFilterable = [],
}: {
  events: EventRow[]
  keptColumns: ColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const columnDefsMap: Partial<Record<ColumnName, ColumnDef<EventRow, any>>> = {
    "company.name": {
      cell: info => info.getValue(),
      header: "Company",
      id: "company.name",
      sortingFn: "alphanumeric",
    },
    title: {
      cell: info => info.getValue(),
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
      columnDefsMap[column].enableColumnFilter = false
    }
  }

  const columnDefs = keptColumns.map((columnName: ColumnName) =>
    columnHelper.accessor(columnName, columnDefsMap[columnName] ?? {}),
  )

  return <TanstackTable data={events} columns={columnDefs} />
}

export default EventTable
