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

interface CompanyTableProps {
  companies: CompanyRow[]
  initialColumns: ColumnName[]
  nonFilterable?: ColumnName[]
}

const CompanyTable = ({ companies, initialColumns, nonFilterable = [] }: CompanyTableProps) => {
  const { data: session } = useSession()

  const columnDefs = useMemo(() => {
    const columnDefsMap: Partial<Record<ColumnName, ColumnDef<CompanyRow, any>>> = {
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
        cell: info => info.getValue(),
        header: "Size",
        id: "size",
        sortingFn: "alphanumeric",
      },
      hq: {
        cell: info => info.getValue(),
        header: "HQ",
        id: "hq",
        sortingFn: "text",
      },
    }

    for (const column of nonFilterable) {
      if (columnDefsMap[column]) {
        columnDefsMap[column]!.enableColumnFilter = false
      }
    }

    return Object.entries(columnDefsMap)
      .filter(([columnName, _]) => session?.user?.role === "ADMIN" || columnName !== "slug")
      .map(([columnName, columnDef]) => columnHelper.accessor(columnName as ColumnName, columnDef))
  }, [nonFilterable, session?.user?.role])

  const invisibleColumns =
    session?.user?.role === "ADMIN"
      ? undefined
      : {
          slug: false,
        }

  const initialColumnVisibility = useMemo(() => {
    const initialColumnVisibility_: Partial<Record<ColumnName, boolean>> = {}
    for (const columnDef of columnDefs) {
      initialColumnVisibility_[columnDef.accessorKey as ColumnName] = false
    }
    initialColumns.forEach(column => (initialColumnVisibility_[column] = true))
    return initialColumnVisibility_
  }, [columnDefs, initialColumns])

  return (
    <TanstackTable
      data={companies}
      columns={columnDefs}
      invisibleColumns={invisibleColumns}
      initialColumnVisibility={initialColumnVisibility}
    />
  )
}

export default CompanyTable
