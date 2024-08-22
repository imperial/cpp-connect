"use client"

import { DeleteEvent } from "@/components/DeleteEvent"
import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"
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

const EventTable = ({
  events,
  columns,
  displayColumns = [],
  nonFilterable = [],
}: {
  events: EventRow[]
  columns: ColumnName[]
  displayColumns?: DisplayColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const columnDefsMap = useMemo(() => {
    const columnDefsMap_: Partial<Record<ColumnName, ColumnDef<EventRow, any>>> = {
      "company.name": {
        cell: info => (
          <Flex align="center" justify="start" gap="4">
            <Flex justify="center" height="4em" maxWidth="8em">
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
      if (columnDefsMap_[column]) {
        columnDefsMap_[column]!.enableColumnFilter = false
      }
    }

    return columnDefsMap_
  }, [nonFilterable])

  const columnDefs = useMemo(
    () =>
      columns.map((columnName: ColumnName) =>
        columnHelper.accessor(
          columnName,
          columnDefsMap[columnName] ?? {
            // default column definition, so that all company values are also accessible
            cell: info => info.getValue() || "N/A",
            header: columnName,
            sortingFn: "alphanumeric",
            id: columnName,
            enableColumnFilter: !(columnName in nonFilterable),
          },
        ),
      ),
    [columnDefsMap, columns, nonFilterable],
  )

  const displayColumnDefsMap: Record<DisplayColumnName, DisplayColumnDef<EventRow, any>> = useMemo(
    () => ({
      adminButtons: {
        cell: info => (
          <Flex gap="2">
            <EditEvent prevEvent={info.row.original} companyID={info.row.original.companyID} />
            <DeleteEvent id={info.row.original.id} companyID={info.row.original.companyID} />
          </Flex>
        ),
        header: "",
        id: "adminButtons",
        enableSorting: false,
        enableColumnFilter: false,
      },
    }),
    [],
  )

  const displayColumnDefs = useMemo(
    () => displayColumns.map((columnName: DisplayColumnName) => columnHelper.display(displayColumnDefsMap[columnName])),
    [displayColumnDefsMap, displayColumns],
  )

  return <TanstackTable data={events} columns={[...columnDefs, ...displayColumnDefs]} />
}

export default EventTable
