"use client"

import styles from "./opportunities.module.scss"

import type { CompanyProfile, Opportunity } from "@prisma/client"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { Box, Button, Flex, IconButton, Table } from "@radix-ui/themes"
import {
  ColumnFiltersState,
  SortDirection,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { info } from "console"
import { formatDistanceToNowStrict } from "date-fns"
import React, { useState } from "react"

const ICON_SIZE = 20

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
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("position", {
    cell: info => info.getValue(),
    header: "Position",
    sortingFn: "text",
  }),
  columnHelper.accessor("location", {
    cell: info => info.getValue(),
    header: "Location",
    sortingFn: "text",
  }),
  columnHelper.accessor("type", {
    cell: info => info.getValue(),
    header: "Type",
    sortingFn: "text",
  }),
  columnHelper.accessor("createdAt", {
    cell: info => formatDistanceToNowStrict(info.getValue(), { addSuffix: true }),
    header: "Posted",
    sortingFn: "datetime",
  }),
]

const getSortingIcon = (isSorted: false | SortDirection): React.ReactNode => {
  switch (isSorted) {
    case false:
      return <ChevronDownIcon style={{ opacity: 0 }} width={ICON_SIZE} height={ICON_SIZE} />
    case "desc":
      return <ChevronDownIcon width={ICON_SIZE} height={ICON_SIZE} />
    case "asc":
      return <ChevronUpIcon width={ICON_SIZE} height={ICON_SIZE} />
  }
}

const ListingTable = ({ opportunities }: ListingTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data: opportunities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters, sorting },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Table.Root size="3">
      <Table.Header>
        {table.getHeaderGroups().map(headerGroup => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Table.ColumnHeaderCell
                key={header.id}
                onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
                className={styles.tableHeader}
              >
                <Flex align="center">
                  <span style={{ flex: "1 1 0" }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </span>
                  {getSortingIcon(header.column.getIsSorted())}
                </Flex>
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {table.getRowModel().rows.map(row => (
          <Table.Row key={row.id}>
            {row
              .getVisibleCells()
              .map(cell =>
                cell.column.getIsFirstColumn() ? (
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
