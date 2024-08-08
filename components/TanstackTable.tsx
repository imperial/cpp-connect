"use client"

import { Dropdown } from "./Dropdown"
import styles from "./tanstack-table.module.scss"

import {
  CaretSortIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import { Select, Spinner, TextField } from "@radix-ui/themes"
import { Box, Button, Flex, Grid, IconButton, Table, Text } from "@radix-ui/themes"
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
import React, { useEffect, useMemo, useState } from "react"
import { Pagination } from "react-headless-pagination"
import { useMediaQuery } from "react-responsive"

const ICON_SIZE = 20

interface ListingTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
}

const getSortingIcon = (isSorted: false | SortDirection): React.ReactNode => {
  switch (isSorted) {
    case false:
      return <CaretSortIcon className={styles.isSortableIndicator} width={ICON_SIZE} height={ICON_SIZE} />
    case "desc":
      return <ChevronDownIcon width={ICON_SIZE} height={ICON_SIZE} />
    case "asc":
      return <ChevronUpIcon width={ICON_SIZE} height={ICON_SIZE} />
  }
}

/**
 * NOTE: To allow columns to be filtered, you must ensure that they have an id and a header
 */
export default function TanstackTable<T>({ data, columns }: ListingTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 15, //default page size
  })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnFilters, sorting, pagination },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
  })

  // Under 900px, wrap the pagination
  const isLowWidth = useMediaQuery({ maxWidth: 900 })

  // Do not render if not mounted
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const filterableColumns = useMemo(
    () =>
      table
        .getAllFlatColumns()
        .filter(col => col.getCanFilter())
        .filter(col => typeof col.columnDef.header !== "undefined")
        .filter(col => typeof col.columnDef.id !== "undefined"),
    [table],
  )

  const [searchQuery, setSearchQuery] = useState("")
  const [currentFilteredColumn, setCurrentFilteredColumn] = useState(filterableColumns[0]?.id ?? "")

  useEffect(() => {
    table.setColumnFilters([{ id: currentFilteredColumn, value: searchQuery }])
  }, [table, searchQuery, currentFilteredColumn])

  if (!isClient) {
    return (
      <Flex align="center" justify="center" p="4" gap="3">
        <Text>Loading...</Text>
        <Spinner size="3" />
      </Flex>
    )
  }

  const FooterWrapper = isLowWidth ? Flex : Grid

  return (
    <Flex gap="4" direction="column">
      <Flex direction="row" gap="3" className={styles.searchBarContainer}>
        <TextField.Root
          placeholder={`Search by ${table.getColumn(currentFilteredColumn)?.columnDef.header?.toString() ?? "..."}`}
          className={styles.searchBar}
          onChange={e => setSearchQuery(e.target.value)}
          value={searchQuery}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
          <TextField.Slot>
            <Button variant="ghost" onClick={() => setSearchQuery("")}>
              Reset
            </Button>
          </TextField.Slot>
        </TextField.Root>
        <Dropdown
          items={filterableColumns.map(col => ({ item: col.columnDef.header!.toString(), value: col.columnDef.id! }))}
          defaultValue={filterableColumns[0]?.id ?? ""}
          onValueChange={setCurrentFilteredColumn}
          triggerProps={{
            "aria-label": "Filter by column",
            title: "Filter by column",
          }}
        />
      </Flex>

      <Table.Root size="2">
        <Table.Header>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Table.ColumnHeaderCell
                  key={header.id}
                  onClick={() =>
                    header.column.getCanSort() && header.column.toggleSorting(header.column.getIsSorted() === "asc")
                  }
                  className={styles.tableHeader}
                >
                  <Flex align="center">
                    <span style={{ flex: "1 1 0" }}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {header.column.getCanSort() && getSortingIcon(header.column.getIsSorted())}
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
        middlePagesSiblingCount={isLowWidth ? 1 : 2}
        edgePageCount={0}
        currentPage={table.getState().pagination.pageIndex}
        setCurrentPage={table.setPageIndex}
        truncableText="..."
      >
        <nav className={styles.tablePagination}>
          <FooterWrapper columns="3" gap="3" width="100%" direction="column" align="center">
            <Box />
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
              <Pagination.NextButton as={<IconButton variant="outline" />}>
                <ChevronRightIcon />
              </Pagination.NextButton>
              <IconButton variant="outline" disabled={!table.getCanNextPage()} onClick={table.lastPage}>
                <DoubleArrowRightIcon />
              </IconButton>
            </ul>
            <Flex justify="end" gap="3">
              <Dropdown
                items={["1", "5", "15", "25", "50"].map(i => ({ item: i, value: i }))}
                defaultValue={table.getState().pagination.pageSize.toString()}
                onValueChange={newPageSize => table.setPageSize(parseInt(newPageSize))}
              />
              <Text className={styles.inlineFlexCenter}>records per page</Text>
            </Flex>
          </FooterWrapper>
        </nav>
      </Pagination>
    </Flex>
  )
}
