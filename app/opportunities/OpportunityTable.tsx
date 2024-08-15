"use client"

import { AddOpportunity } from "@/components/AddOpportunity"
import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"

import { getCompanyLink } from "../companies/getCompanyLink"
import type { CompanyProfile, Opportunity } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"
import { useMemo } from "react"

type OpportunityRow = {
  company: CompanyProfile
} & Opportunity

type ColumnName = keyof OpportunityRow | `company.${keyof CompanyProfile}` | "editButton"

const columnHelper = createColumnHelper<OpportunityRow>()

const OpportunityTable = ({
  opportunities,
  columns,
  nonFilterable = [],
}: {
  opportunities: OpportunityRow[]
  columns: ColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const columnDefsMap = useMemo(() => {
    const columnDefsMap_: Partial<Record<ColumnName, ColumnDef<OpportunityRow, any>>> = {
      "company.name": {
        cell: info => <Link href={getCompanyLink(info.row.original.company)}>{info.getValue()}</Link>,
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
      editButton: {
        cell: info => <AddOpportunity prevOpportunity={info.row.original} />,
        header: "",
        id: "editButton",
        enableSorting: false,
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

  return <TanstackTable data={opportunities} columns={columnDefs} />
}

export default OpportunityTable
