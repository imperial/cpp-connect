"use client"

import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"

import { getCompanyLink } from "./getCompanyLink"
import styles from "./table.module.scss"

import type { CompanyProfile } from "@prisma/client"
import { Flex } from "@radix-ui/themes"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useMemo } from "react"

type CompanyRow = Pick<CompanyProfile, "logo" | "name" | "sector" | "size" | "hq" | "slug">

type ColumnName = keyof CompanyRow

const columnHelper = createColumnHelper<CompanyRow>()

const CompanyTable = ({
  companies,
  columns,
  nonFilterable = [],
}: {
  companies: CompanyRow[]
  columns: ColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const { data: session } = useSession()

  const columnDefsMap = useMemo(() => {
    const columnDefsMap_: Partial<Record<ColumnName, ColumnDef<CompanyRow, any>>> = {
      name: {
        cell: info => (
          <Flex align="center" gap="4">
            <Flex height="4em" width="8em">
              {info.getValue() && (
                <Image
                  unoptimized
                  src={`/api/uploads/${info.row.original.logo}`}
                  alt="profile teaser"
                  width={100}
                  height={100}
                  className={styles.teaser}
                />
              )}
            </Flex>
            <Link href={getCompanyLink(info.row.original)}>{info.getValue()}</Link>
          </Flex>
        ),
        header: "Company",
        id: "name",
        sortingFn: "text",
      },
      // shown only if admin
      slug: {
        cell: info => info.getValue(),
        header: "Slug",
        id: "slug",
        sortingFn: "text",
      },
      sector: {
        cell: info => info.getValue(),
        header: "Sector",
        id: "sector",
        sortingFn: "text",
      },
      size: {
        cell: info => info.getValue() || "N/A",
        header: "Size",
        id: "size",
        sortingFn: "alphanumeric",
      },
      hq: {
        cell: info => info.getValue() || "N/A",
        header: "HQ",
        id: "hq",
        sortingFn: "text",
      },
    }

    for (const column of nonFilterable) {
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
            cell: info => info.getValue() || "N/A",
            header: columnName,
            sortingFn: "alphanumeric",
            id: columnName,
            enableColumnFilter: !(columnName in nonFilterable),
          },
        ),
      ),
    [columnDefsMap, columns, nonFilterable],
  )

  const invisibleColumns =
    session?.user?.role === "ADMIN"
      ? undefined
      : {
          slug: false,
        }

  return <TanstackTable data={companies} columns={columnDefs} invisibleColumns={invisibleColumns} />
}

export default CompanyTable
