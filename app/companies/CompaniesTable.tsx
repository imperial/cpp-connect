"use client"

import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"

import { getCompanyLink } from "./getCompanyLink"
import styles from "./table.module.scss"

import type { CompanyProfile } from "@prisma/client"
import { Box } from "@radix-ui/themes"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import Image from "next/image"

type CompanyRow = Pick<CompanyProfile, "logo" | "name" | "sector" | "size" | "hq" | "slug">

type ColumnName = keyof CompanyRow

const columnHelper = createColumnHelper<CompanyRow>()

const CompaniesTable = ({
  companies,
  columns,
  nonFilterable = [],
}: {
  companies: CompanyRow[]
  columns: ColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const { data: session } = useSession()

  const columnDefsMap: Partial<Record<ColumnName, ColumnDef<CompanyRow, any>>> = {
    logo: {
      cell: info => (
        <Box width="4em" height="2.5em">
          <Image src={info.getValue()} alt="profile teaser" width={100} height={100} className={styles.teaser} />
        </Box>
      ),
      header: "",
    },
    name: {
      cell: info => <Link href={`/companies/${info.getValue()}`}>{info.getValue()}</Link>,
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

  for (let column of nonFilterable) {
    if (columnDefsMap[column]) {
      columnDefsMap[column]!.enableColumnFilter = false
    }
  }

  const columnDefs = columns.map((columnName: ColumnName) =>
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
  )

  const invisibleColumns =
    session?.user?.role === "ADMIN"
      ? undefined
      : {
        slug: false,
      }

  return <TanstackTable data={companies} columns={columnDefs} invisibleColumns={invisibleColumns} />
}

export default CompaniesTable
