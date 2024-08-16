"use client"

import Link from "@/components/Link"
import TanstackTable from "@/components/TanstackTable"
import UserAvatar from "@/components/UserAvatar"

import { StudentProfile, User } from "@prisma/client"
import { Flex } from "@radix-ui/themes"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"
import { useMemo } from "react"

type StudentRow = {
  user: Pick<User, "name" | "updatedAt" | "image" | "role">
} & Pick<StudentProfile, "graduationDate" | "course" | "studentShortcode">

const columnHelper = createColumnHelper<StudentRow>()

type ColumnName = keyof StudentRow | `user.${keyof Pick<User, "name" | "updatedAt" | "image" | "role">}`

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
        cell: info => info.getValue()?.getFullYear(),
        header: "Graduating",
        sortingFn: "datetime",
        id: "graduationDate",
        enableColumnFilter: true,
      },
      course: {
        cell: info => info.getValue(),
        header: "Course",
        id: "course",
        sortingFn: "text",
      },
      "user.updatedAt": {
        cell: info => (
          <time suppressHydrationWarning={true}>
            {formatDistanceToNowStrict(info.getValue(), { addSuffix: true })}{" "}
          </time>
        ),
        header: "Last Updated",
        id: "updatedAt",
        sortingFn: "datetime",
      },
      "user.image": {
        cell: info => (
          <Flex align="center" justify="center">
            <UserAvatar user={info.row.original.user} size="2" />
          </Flex>
        ),
        header: "",
        id: "user.image",
        enableSorting: false,
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
            // default column definition, so that all student values are also accessible
            cell: info => info.getValue(),
            header: columnName,
            sortingFn: "alphanumeric",
            id: columnName,
            enableColumnFilter: !nonFilterable.includes(columnName),
          },
        ),
      ),
    [columnDefsMap, columns, nonFilterable],
  )

  return <TanstackTable data={students} columns={columnDefs} />
}

export default StudentTable
