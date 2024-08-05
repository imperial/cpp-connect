"use client"

import type { CompanyProfile, Opportunity } from "@prisma/client"
import { Table } from "@radix-ui/themes"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { info } from "console"
import { formatDistanceToNowStrict } from "date-fns"
import React from "react"

type OpportunityRow = {
  company: CompanyProfile
} & Opportunity

interface ListingTableProps {
  opportunities: OpportunityRow[]
}

const columnHelper = createColumnHelper<OpportunityRow>()

const columns = [
  columnHelper.accessor("company.name", {
    cell: info => info.getValue(),
    header: "Company",
    id: "company.name",
  }),
  columnHelper.accessor("position", {
    cell: info => info.getValue(),
    header: "Position",
  }),
  columnHelper.accessor("location", {
    cell: info => info.getValue(),
    header: "Location",
  }),
  columnHelper.accessor("type", {
    cell: info => info.getValue(),
    header: "Type",
  }),
  columnHelper.accessor("createdAt", {
    cell: info => formatDistanceToNowStrict(info.getValue(), { addSuffix: true }),
    header: "Posted",
  }),
]

const ListingTable = ({ opportunities }: ListingTableProps) => {
  const table = useReactTable({
    data: opportunities,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Table.Root size="3">
      <Table.Header>
        <Table.Row>
          {table.getFlatHeaders().map(header => (
            <Table.ColumnHeaderCell key={header.id}>
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {table.getRowModel().rows.map(row => (
          <Table.Row key={row.id}>
            {row
              .getVisibleCells()
              .map(cell =>
                cell.column.columnDef.id === "company.name" ? (
                  <Table.RowHeaderCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.RowHeaderCell>
                ) : (
                  <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                ),
              )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}

export default ListingTable
