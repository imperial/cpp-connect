"use client"

import TanstackTable from "@/components/TanstackTable"

import type { CompanyProfile, Opportunity } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"

type OpportunityRow = {
  company: CompanyProfile
} & Opportunity

const columnHelper = createColumnHelper<OpportunityRow>()

const OpportunityTable = ({
  opportunities,
  hideCompanyName = false,
}: {
  opportunities: OpportunityRow[]
  hideCompanyName?: boolean
}) => {
  const columns = [
    columnHelper.accessor("company.name", {
      cell: info => info.getValue(),
      header: "Company",
      id: "company.name",
      sortingFn: "alphanumeric",
      enableColumnFilter: !hideCompanyName,
    }),
    columnHelper.accessor("position", {
      cell: info => info.getValue(),
      header: "Position",
      sortingFn: "text",
      id: "position",
    }),
    columnHelper.accessor("location", {
      cell: info => info.getValue(),
      header: "Location",
      sortingFn: "text",
      id: "location",
    }),
    columnHelper.accessor("type", {
      cell: info => info.getValue(),
      header: "Type",
      sortingFn: "text",
      id: "type",
    }),
    columnHelper.accessor("createdAt", {
      cell: info => (
        <time suppressHydrationWarning={true}>{formatDistanceToNowStrict(info.getValue(), { addSuffix: true })} </time>
      ),
      header: "Posted",
      sortingFn: "datetime",
      id: "posted",
      enableColumnFilter: false,
    }),
  ]

  return (
    <TanstackTable data={opportunities} columns={columns} columnVisibility={{ "company.name": !hideCompanyName }} />
  )
}

export default OpportunityTable
