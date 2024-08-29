"use client"

import { DeleteEvent } from "@/components/DeleteEvent"
import Link from "@/components/Link"
import TanstackTable, { dateFilterFn } from "@/components/TanstackTable"
import { EditEvent } from "@/components/UpsertEvent"

import styles from "./eventTable.module.scss"

import { getCompanyLink } from "../companies/getCompanyLink"
import type { CompanyProfile, Event } from "@prisma/client"
import { Flex } from "@radix-ui/themes"
import { ColumnDef, DisplayColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import Image from "next/image"
import { useMemo } from "react"

type EventRow = {
  company: CompanyProfile
} & Event

const columnHelper = createColumnHelper<EventRow>()

type DisplayColumnName = "adminButtons"

type ColumnName = keyof EventRow | `company.${keyof CompanyProfile}`

interface EventTableProps {
  events: EventRow[]
  initialColumns: ColumnName[]
  displayColumns?: DisplayColumnName[]
  nonFilterable?: ColumnName[]
}

const EventTable = ({ events, initialColumns, displayColumns = [], nonFilterable = [] }: EventTableProps) => {
  const columnDefs = useMemo(() => {
    const columnDefsMap: Partial<Record<ColumnName, ColumnDef<EventRow, any>>> = {
      "company.name": {
        cell: info => (
          <Flex align="center" gap="4">
            <Flex height="4em" width="8em">
              {info.getValue() && (
                <Image
                  unoptimized
                  src={`/api/uploads/${info.row.original.company.logo}`}
                  alt="profile teaser"
                  width={100}
                  height={100}
                  className={styles.logo}
                />
              )}
            </Flex>
            <Link href={getCompanyLink(info.row.original.company)}>{info.getValue()}</Link>
          </Flex>
        ),
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
        cell: info => (
          <time suppressHydrationWarning={true}>{format(info.getValue(), "eeee, MMMM do 'at' HH:mm ")}</time>
        ),
        header: "Start Date",
        sortingFn: "datetime",
        id: "dateStart",
        filterFn: dateFilterFn,
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

    return Object.entries(columnDefsMap).map(([columnName, columnDef]) =>
      columnHelper.accessor(columnName as ColumnName, columnDef),
    )
  }, [nonFilterable])

  const displayColumnDefs: DisplayColumnDef<EventRow, any>[] = useMemo(
    () => [
      columnHelper.display({
        cell: info => (
          <Flex gap="2">
            <EditEvent prevEvent={info.row.original} companyID={info.row.original.companyID} />
            <DeleteEvent id={info.row.original.id} companyID={info.row.original.companyID} />
          </Flex>
        ),
        header: "Admin Actions",
        id: "adminButtons",
        enableSorting: false,
        enableColumnFilter: false,
      }),
    ],
    [],
  )

  const initialColumnVisibility = useMemo(() => {
    const initialColumnVisibility_: Partial<Record<ColumnName, boolean>> = {}
    for (const columnDef of columnDefs) {
      initialColumnVisibility_[columnDef.accessorKey as ColumnName] = false
    }
    initialColumns.forEach(column => (initialColumnVisibility_[column] = true))
    return initialColumnVisibility_
  }, [columnDefs, initialColumns])

  return (
    <TanstackTable
      data={events}
      columns={[...columnDefs, ...(displayColumns.includes("adminButtons") ? displayColumnDefs : [])]}
      initialColumnVisibility={initialColumnVisibility}
    />
  )
}

export default EventTable
