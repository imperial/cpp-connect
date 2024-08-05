"use client"

import styles from "./tanstack-table.module.scss"

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Button, Flex, IconButton, Table } from "@radix-ui/themes"
import {
  ColumnDef,
  ColumnFiltersState,
  SortDirection,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import React, { useState } from "react"
import { Pagination } from "react-headless-pagination"

const ICON_SIZE = 20

interface ListingTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
}

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

export default function TanstackTable<T>({ data, columns }: ListingTableProps<T>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 15, //default page size
  })
  const table = useReactTable({
    data,
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
