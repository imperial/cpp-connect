"use client"

import TanstackTable from "@/components/TanstackTable"

import styles from "./table.module.scss"

import type { CompanyProfile } from "@prisma/client"
import { Link as RadixLink } from "@radix-ui/themes"
import { Box } from "@radix-ui/themes"
import { createColumnHelper } from "@tanstack/react-table"
import Image from "next/image"
import Link from "next/link"

type CompanyRow = Pick<CompanyProfile, "logo" | "name" | "sector" | "website" | "size" | "hq">

const columnHelper = createColumnHelper<CompanyRow>()

const columns = [
  columnHelper.accessor("logo", {
    cell: info => (
      <Box width="4em" height="2.5em">
        <Image src={info.getValue()} alt="profile teaser" width={100} height={100} className={styles.teaser} />
      </Box>
    ),
    header: "",
  }),
  columnHelper.accessor("name", {
    cell: info => (
      <RadixLink asChild>
        <Link href={`/companies/${info.getValue()}`}>{info.getValue()}</Link>
      </RadixLink>
    ),
    header: "Company",
    id: "name",
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
  return <TanstackTable data={companies} columns={columns} />
}

export default CompaniesTable
