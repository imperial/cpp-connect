"use client"

import styles from "./opportunities.module.scss"

import type { CompanyProfile, Opportunity } from "@prisma/client"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Box, Button, Flex, IconButton, Table } from "@radix-ui/themes"
import {
  ColumnFiltersState,
  SortDirection,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { info } from "console"
import { formatDistanceToNowStrict } from "date-fns"
import React, { useState } from "react"
import { Pagination } from "react-headless-pagination"
import ReactPaginate from "react-paginate"

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
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 15, //default page size
  })
  const table = useReactTable({
    data: opportunities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters, sorting, pagination },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
  })

  return (
    <Flex gap="4" direction="column">
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
      <Pagination
        totalPages={table.getPageCount()}
        middlePagesSiblingCount={2}
        edgePageCount={0}
        currentPage={table.getState().pagination.pageIndex}
        setCurrentPage={table.setPageIndex}
        className=""
        truncableText="..."
        truncableClassName=""
      >
        <nav className={styles.tablePagination}>
          <ul>
            <IconButton variant="outline" disabled={!table.getCanPreviousPage()} onClick={table.firstPage}>
              <DoubleArrowLeftIcon />
            </IconButton>
            <Pagination.PrevButton className="" as={<IconButton variant="outline" />}>
              <ChevronLeftIcon />
            </Pagination.PrevButton>
            <Pagination.PageButton
              as={<Button variant="outline" />}
              activeClassName={styles.activePage}
              inactiveClassName=""
              className=""
            />
            <Pagination.NextButton className="" as={<IconButton variant="outline" />}>
              <ChevronRightIcon />
            </Pagination.NextButton>
            <IconButton variant="outline" disabled={!table.getCanNextPage()} onClick={table.lastPage}>
              <DoubleArrowRightIcon />
            </IconButton>
          </ul>
        </nav>
      </Pagination>
    </Flex>
  )
}

export default ListingTable
