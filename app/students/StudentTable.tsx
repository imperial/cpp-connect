"use client"

import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"

import { StudentProfile, User } from "@prisma/client"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"
import { useMemo } from "react"

type StudentRow = {
  user: Pick<User, "name" | "updatedAt">
} & Pick<StudentProfile, "graduationDate" | "course" | "studentShortcode">

const columnHelper = createColumnHelper<StudentRow>()

type ColumnName = keyof StudentRow | `user.${keyof Pick<User, "name" | "updatedAt">}`

const StudentTable = ({
  students,
  columns,
  nonFilterable = [],
}: {
  students: StudentRow[]
  columns: ColumnName[]
  nonFilterable?: ColumnName[]
}) => {
  const columnDefsMap = useMemo(() => {
    const columnDefsMap_: Partial<Record<ColumnName, ColumnDef<StudentRow, any>>> = {
      "user.name": {
        cell: info => <Link href={`/students/${info.row.original.studentShortcode}`}>{info.getValue()}</Link>,
        header: "Name",
        id: "name",
        sortingFn: "text",
      },
      graduationDate: {
        cell: info => info.getValue()?.getFullYear() ?? "N/A",
        header: "Graduating",
        sortingFn: "datetime",
      },
      course: {
        cell: info => info.getValue(),
        header: "Course",
        sortingFn: "text",
      },
      "user.updatedAt": {
        cell: info => (
          <time suppressHydrationWarning={true}>
            {formatDistanceToNowStrict(info.getValue(), { addSuffix: true })}{" "}
          </time>
        ),
        header: "Last Updated",
        sortingFn: "datetime",
      },
    }

    for (let column of nonFilterable) {
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

  return <TanstackTable data={students} columns={columnDefs} />
}

export default StudentTable
