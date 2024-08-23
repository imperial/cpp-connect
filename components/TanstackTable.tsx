"use client"

import Chip from "./Chip"
import DateTimePicker from "./DateTimePicker"
import { Dropdown } from "./Dropdown"
import styles from "./tanstack-table.module.scss"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons"
import { Spinner, TextField } from "@radix-ui/themes"
import { Box, Button, Flex, Grid, IconButton, Table, Text } from "@radix-ui/themes"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortDirection,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { format, isAfter } from "date-fns"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Pagination } from "react-headless-pagination"
import { useMediaQuery } from "react-responsive"

const ICON_SIZE = 20

interface TanstackTableProps<T> {
  data: T[]
  columns: ColumnDef<T, any>[]
  enablePagination?: boolean
  enableSearch?: boolean
  invisibleColumns?: VisibilityState
}

const formatDateRange = (dates: [string, string]): string => {
  const [start, end] = dates
  if (start && end) {
    return `between "${format(start, "dd-MM-yyyy")}" and "${format(end, "dd-MM-yyyy")}"`
  }
  if (start) {
    return `on or after "${format(start, "dd-MM-yyyy")}"`
  }
  if (end) {
    return `on or before "${format(end, "dd-MM-yyyy")}"`
  }
  return ""
}

/**
 * Filter function for columns with type date. Keeps rows which are after the start date (if set) and before the end date (if set).
 * @template T The type of the row
 * @param row The row to filter
 * @param id The column id to filter
 * @param filterValue The filter value to be applied of the form [start, end]
 * @returns Whether the row should be displayed
 */
export const dateFilterFn = <T,>(row: Row<T>, id: string, filterValue: [string, string]): boolean =>
  (!filterValue[0] || isAfter(row.getValue(id), filterValue[0] + "T00:00")) &&
  (!filterValue[1] || isAfter(filterValue[1] + "T23:59", row.getValue(id)))

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
export default function TanstackTable<T>({
  data,
  columns,
  invisibleColumns,
  enablePagination = true,
  enableSearch = true,
}: TanstackTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})

  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 15, //default page size
  })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnFilters, sorting, pagination, columnVisibility: { ...columnVisibility, ...invisibleColumns } },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    onColumnFiltersChange: setColumnFilters,
    enableColumnFilters: enableSearch,
  })

  // Under 900px, wrap the pagination
  const isLowWidth = useMediaQuery({ maxWidth: 900 })

  // Do not render if not mounted
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const dateFilterColumns = useMemo(() => {
    return columns.filter(column => column.sortingFn === "datetime").map(column => column.id)
  }, [columns])

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
  const [prevFilters, setPrevFilters] = useState<ColumnFiltersState>([])
  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")

  const FooterWrapper = isLowWidth ? Flex : Grid

  /** Creates a chip to display a filter that the user has created as they were typing into the search box & they have since pressed Add Filter */
  const addChip = useCallback(() => {
    if (dateFilterColumns.includes(currentFilteredColumn)) {
      setPrevFilters([
        ...prevFilters.filter(f => f.id !== currentFilteredColumn), // Remove the previous filter for the same column
        { id: currentFilteredColumn, value: [dateStart, dateEnd] },
      ])
      setDateStart("")
      setDateEnd("")
    } else {
      setPrevFilters([
        ...prevFilters.filter(f => f.id !== currentFilteredColumn), // Remove the previous filter for the same column
        { id: currentFilteredColumn, value: searchQuery },
      ])
      setSearchQuery("")
    }
  }, [currentFilteredColumn, dateEnd, dateFilterColumns, dateStart, prevFilters, searchQuery])

  /** Unset a filter and delete its chip that is displayed to the user */
  const deleteChip = useCallback(
    (index: number) => {
      setPrevFilters(prevFilters.filter((_, i) => i !== index))
      setColumnFilters([...columnFilters.filter((_, i) => i !== index)])
    },
    [columnFilters, prevFilters],
  )

  /**
   * Update the chips, and then set the filters on the table.
   *
   * If a filter already exists & is shown as a chip, update the chip instead of setting a new filter.
   */
  const updateFilters = useCallback(
    (value: any) => {
      const newFilters = [
        ...columnFilters.filter(f => f.id !== currentFilteredColumn), // Remove the previous filter for the same column
        { id: currentFilteredColumn, value }, // Add the new filter for this column
      ]

      // Live-update filter chips which are currently displayed (i.e. in prevFilters)
      if (prevFilters.find(f => f.id === currentFilteredColumn)) {
        if (!value || (Array.isArray(value) && value.every(v => !v))) {
          // Delete the chip if the search query is now empty
          setPrevFilters(prevFilters.filter(f => f.id !== currentFilteredColumn))
        } else {
          // Update the chip with the new search query
          setPrevFilters(newFilters)
        }
      }

      // Update the actual filters that are applied to the table
      setColumnFilters(newFilters)
    },
    [columnFilters, currentFilteredColumn, prevFilters],
  )

  /** Clears the current filter if it is not set as a chip */
  const clearCurrentFilter = useCallback(() => {
    if (!prevFilters.find(f => f.id === currentFilteredColumn)) {
      setColumnFilters(columnFilters.filter(f => f.id !== currentFilteredColumn))
    }

    setSearchQuery("")
  }, [columnFilters, currentFilteredColumn, prevFilters])

  if (!isClient) {
    return (
      <Flex align="center" justify="center" p="4" gap="3">
        <Text>Loading...</Text>
        <Spinner size="3" />
      </Flex>
    )
  }

  return (
    <Flex gap="4" direction="column" width="100%">
      {enableSearch && (
        <Flex direction="column" gap="3">
          <Flex justify="center" gap="3" className={styles.searchBarContainer}>
            {!dateFilterColumns.includes(currentFilteredColumn) ? (
              <TextField.Root
                placeholder={`Search by ${table.getColumn(currentFilteredColumn)?.columnDef.header?.toString() ?? "..."}`}
                className={styles.searchBar}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    addChip()
                  }
                }}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  updateFilters(e.target.value)
                }}
                value={searchQuery}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
                <TextField.Slot>
                  <Button variant="ghost" onClick={clearCurrentFilter}>
                    Reset
                  </Button>
                </TextField.Slot>
              </TextField.Root>
            ) : (
              <Flex gap="3">
                <Flex asChild gap="2" align="center">
                  <label>
                    <Text>Start:</Text>
                    <DateTimePicker
                      showTime={false}
                      name="dateStart"
                      placeholder="Enter start date here"
                      onChange={e => {
                        setDateStart(e.target.value)
                        updateFilters([e.target.value, dateEnd])
                      }}
                      value={dateStart}
                    />
                  </label>
                </Flex>
                <Flex asChild gap="2" align="center">
                  <label>
                    <Text>End:</Text>
                    <DateTimePicker
                      showTime={false}
                      name="dateEnd"
                      placeholder="Enter end date here"
                      onChange={e => {
                        setDateEnd(e.target.value)
                        updateFilters([dateStart, e.target.value])
                      }}
                      value={dateEnd}
                    />
                  </label>
                </Flex>
              </Flex>
            )}
            <Dropdown
              items={filterableColumns.map(col => ({
                item: col.columnDef.header!.toString(),
                value: col.columnDef.id!,
              }))}
              defaultValue={filterableColumns[0].id ?? ""}
              onValueChange={newFilterCol => {
                clearCurrentFilter()

                setCurrentFilteredColumn(newFilterCol)
                setDateStart("")
                setDateEnd("")
              }}
              triggerProps={{
                "aria-label": "Filter by column",
                title: "Filter by column",
              }}
            />
            <Button
              disabled={dateFilterColumns.includes(currentFilteredColumn) ? !(dateStart || dateEnd) : !searchQuery}
              onClick={addChip}
            >
              Add filter
            </Button>
          </Flex>
          <Flex gap="2" justify="center">
            {prevFilters.map(({ id, value }, index) => (
              <Chip
                key={index}
                label={
                  dateFilterColumns.includes(id)
                    ? `${columns.find(def => def.id === id)?.header} ${formatDateRange(value as [string, string])}`
                    : `${columns.find(def => def.id === id)?.header} includes "${value}"`
                }
                deletable
                onDelete={() => deleteChip(index)}
              />
            ))}
          </Flex>
        </Flex>
      )}

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

        <Table.Body className={styles.tanstackBody}>
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
      <Flex justify="between">
        <DropdownMenu.Root>
          <Button asChild variant="surface" color="gray">
            <DropdownMenu.Trigger>
              <Text>Choose columns to display</Text>
              <ChevronDownIcon />
            </DropdownMenu.Trigger>
          </Button>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={styles.DropdownMenuContent + " radix-themes"}>
              {table.getAllLeafColumns().map((column, index) => (
                <DropdownMenu.CheckboxItem
                  key={index}
                  checked={column.getIsVisible()}
                  onSelect={e => {
                    column.getToggleVisibilityHandler()(e)
                    e.preventDefault()
                  }}
                  className={styles.DropdownMenuCheckboxItem}
                >
                  <DropdownMenu.ItemIndicator className={styles.DropdownMenuItemIndicator}>
                    <CheckIcon />
                  </DropdownMenu.ItemIndicator>
                  <Text>{column.columnDef.header?.toString()}</Text>
                </DropdownMenu.CheckboxItem>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {enablePagination && (
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
        )}
      </Flex>
    </Flex>
  )
}
