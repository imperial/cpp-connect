"use client"

import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"

import { getCompanyLink } from "./getCompanyLink"
import styles from "./table.module.scss"

import type { CompanyProfile } from "@prisma/client"
import { Box } from "@radix-ui/themes"
import { createColumnHelper } from "@tanstack/react-table"
import { useSession } from "next-auth/react"
import Image from "next/image"

type CompanyRow = Pick<CompanyProfile, "logo" | "name" | "sector" | "size" | "hq" | "slug">

const columnHelper = createColumnHelper<CompanyRow>()

const columns = [
  columnHelper.accessor("logo", {
    cell: info => (
      <Box width="4em" height="2.5em">
        <Image
          unoptimized
          src={info.getValue() ? `/api/uploads/${info.getValue()}` : ""}
          alt="profile teaser"
          width={100}
          height={100}
          className={styles.teaser}
        />
      </Box>
    ),
    header: "",
  }),
  columnHelper.accessor("name", {
    cell: info => <Link href={getCompanyLink(info.row.original)}>{info.getValue()}</Link>,
    header: "Company",
    id: "name",
    sortingFn: "text",
  }),
  // shown only if admin
  columnHelper.accessor("slug", {
    cell: info => info.getValue(),
    header: "Slug",
    id: "slug",
    sortingFn: "text",
  }),
  columnHelper.accessor("sector", {
    cell: info => info.getValue(),
    header: "Sector",
    id: "sector",
    sortingFn: "text",
  }),
  columnHelper.accessor("size", {
    cell: info => info.getValue() ?? "N/A",
    header: "Size",
    id: "size",
    sortingFn: "alphanumeric",
  }),
  columnHelper.accessor("hq", {
    cell: info => info.getValue() ?? "N/A",
    header: "HQ",
    id: "hq",
    sortingFn: "text",
  }),
]

const CompaniesTable = ({ companies }: { companies: CompanyRow[] }) => {
  const { data: session } = useSession()

  const invisibleColumns =
    session?.user?.role === "ADMIN"
      ? undefined
      : {
          slug: false,
        }

  return <TanstackTable data={companies} columns={columns} invisibleColumns={invisibleColumns} />
}

export default CompaniesTable
