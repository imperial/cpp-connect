"use client"

import { DeleteOpportunity } from "@/components/DeleteOpportunity"
import Link from "@/components/Link"
import TanstackTable, { dateFilterFn } from "@/components/TanstackTable"
import { EditOpportunity } from "@/components/UpsertOpportunity"

import styles from "./opportunityTable.module.scss"

import { getCompanyLink } from "../companies/getCompanyLink"
import type { CompanyProfile, Opportunity } from "@prisma/client"
import { Flex } from "@radix-ui/themes"
import { ColumnDef, DisplayColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format, formatDistanceToNowStrict } from "date-fns"
import Image from "next/image"
import { useMemo } from "react"

type OpportunityRow = {
  company: CompanyProfile
} & Opportunity

type ColumnName = keyof OpportunityRow | `company.${keyof CompanyProfile}`

type DisplayColumnName = "adminButtons"

const columnHelper = createColumnHelper<OpportunityRow>()

interface OpportunityTableProps {
  opportunities: OpportunityRow[]
  initialColumns: ColumnName[]
  displayColumns?: DisplayColumnName[]
  nonFilterable?: ColumnName[]
}

const OpportunityTable = ({
  opportunities,
  initialColumns,
  displayColumns = [],
  nonFilterable = [],
}: OpportunityTableProps) => {
  const columnDefs = useMemo(() => {
    const columnDefsMap: Partial<Record<ColumnName, ColumnDef<OpportunityRow, any>>> = {
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
      position: {
        cell: info => <Link href={`/opportunities/${info.row.original.id}`}>{info.getValue()}</Link>,
        header: "Position",
        sortingFn: "text",
        id: "position",
      },
      location: {
        cell: info => info.getValue(),
        header: "Location",
        sortingFn: "text",
        id: "location",
      },
      type: {
        cell: info => info.getValue(),
        header: "Type",
        sortingFn: "text",
        id: "type",
      },
      createdAt: {
        cell: info => (
          <time suppressHydrationWarning={true}>
            {formatDistanceToNowStrict(info.getValue(), { addSuffix: true })}{" "}
          </time>
        ),
        header: "Posted",
        sortingFn: "datetime",
        id: "posted",
        filterFn: dateFilterFn,
      },
      deadline: {
        cell: info => <time suppressHydrationWarning={true}>{format(info.getValue(), "EEEE do MMMM yyyy")}</time>,
        header: "Application Deadline",
        sortingFn: "datetime",
        id: "deadline",
        filterFn: dateFilterFn,
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

  const displayColumnDefs: DisplayColumnDef<OpportunityRow, any>[] = useMemo(
    () => [
      columnHelper.display({
        cell: info => (
          <Flex gap="2">
            <EditOpportunity prevOpportunity={info.row.original} companyID={info.row.original.companyID} />
            <DeleteOpportunity id={info.row.original.id} companyID={info.row.original.companyID} />
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
      data={opportunities}
      columns={[...columnDefs, ...displayColumnDefs]}
      initialColumnVisibility={initialColumnVisibility}
    />
  )
}

export default OpportunityTable
