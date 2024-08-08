"use client"

import TanstackTable from "@/components/TanstackTable"

import type { CompanyProfile, Opportunity } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"

type OpportunityRow = {
  company: CompanyProfile
} & Opportunity

type ColumnName = "id" | "companyID" | "position" | "location" | "available" | "type" | "createdAt" | "company.name"

const columnHelper = createColumnHelper<OpportunityRow>()

const OpportunityTable = ({
  opportunities,
  keptColumns,
  nonFilterable = [],
}: {
  opportunities: OpportunityRow[]
  keptColumns: ColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const columnDefsMap: Partial<Record<ColumnName, ColumnDef<OpportunityRow, any>>> = {
    "company.name": {
      cell: info => info.getValue(),
      header: "Company",
      id: "company.name",
      sortingFn: "alphanumeric",
    },
    position: {
      cell: info => info.getValue(),
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
        <time suppressHydrationWarning={true}>{formatDistanceToNowStrict(info.getValue(), { addSuffix: true })} </time>
      ),
      header: "Posted",
      sortingFn: "datetime",
      id: "posted",
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

  return <TanstackTable data={opportunities} columns={columnDefs} />
}

export default OpportunityTable
