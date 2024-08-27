"use client"

import { DeleteOpportunity } from "@/components/DeleteOpportunity"
import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"
import { EditOpportunity } from "@/components/UpsertOpportunity"

import styles from "./opportunityTable.module.scss"

import { getCompanyLink } from "../companies/getCompanyLink"
import type { CompanyProfile, Opportunity } from "@prisma/client"
import { Flex } from "@radix-ui/themes"
import { ColumnDef, DisplayColumnDef, createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"
import Image from "next/image"
import { useMemo } from "react"

type OpportunityRow = {
  company: CompanyProfile
} & Opportunity

type ColumnName = keyof OpportunityRow | `company.${keyof CompanyProfile}`

type DisplayColumnName = "adminButtons"

const columnHelper = createColumnHelper<OpportunityRow>()

const OpportunityTable = ({
  opportunities,
  columns,
  displayColumns = [],
  nonFilterable = [],
}: {
  opportunities: OpportunityRow[]
  columns: ColumnName[]
  displayColumns?: DisplayColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const columnDefsMap = useMemo(() => {
    const columnDefsMap_: Partial<Record<ColumnName, ColumnDef<OpportunityRow, any>>> = {
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
        // TODO: Allow display columns to be passed in from columns (rather than just accessor columns)
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
      ),
    [columns, columnDefsMap, nonFilterable],
  )

  const displayColumnDefsMap: Record<DisplayColumnName, DisplayColumnDef<OpportunityRow, any>> = useMemo(
    () => ({
      adminButtons: {
        cell: info => (
          <Flex gap="2">
            <EditOpportunity prevOpportunity={info.row.original} companyID={info.row.original.companyID} />
            <DeleteOpportunity id={info.row.original.id} companyID={info.row.original.companyID} />
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

  return <TanstackTable data={opportunities} columns={[...columnDefs, ...displayColumnDefs]} />
}

export default OpportunityTable
