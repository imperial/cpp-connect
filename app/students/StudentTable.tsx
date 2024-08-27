"use client"

import Link from "@/components/Link"
import TanstackTable, { arrayFilterFn, dateFilterFn } from "@/components/TanstackTable"
import UserAvatar from "@/components/UserAvatar"

import { StudentProfile, User } from "@prisma/client"
import { Flex } from "@radix-ui/themes"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"
import { useMemo } from "react"

type StudentRow = {
  user: Pick<User, "name" | "image" | "role">
} & Pick<
  StudentProfile,
  "updatedAt" | "interests" | "skills" | "lookingFor" | "graduationDate" | "course" | "studentShortcode"
>

interface StudentTableProps {
  students: StudentRow[]
  initialColumns: ColumnName[]
  nonFilterable?: ColumnName[]
}

const columnHelper = createColumnHelper<StudentRow>()

type ColumnName = keyof StudentRow | `user.${keyof Pick<User, "name" | "image" | "role">}`

const StudentTable = ({ students, initialColumns, nonFilterable = [] }: StudentTableProps) => {
  const columnDefs = useMemo(() => {
    const columnDefsMap: Partial<Record<ColumnName, ColumnDef<StudentRow, any>>> = {
      "user.name": {
        cell: info => (
          <Flex align="center" justify="start" gap="4">
            <UserAvatar user={info.row.original.user} size="2" />
            <Link href={`/students/${info.row.original.studentShortcode}`}>{info.getValue()}</Link>
          </Flex>
        ),
        header: "Name",
        id: "name",
        sortingFn: "text",
      },
      graduationDate: {
        cell: info => info.getValue()?.getFullYear(),
        header: "Graduating",
        sortingFn: "datetime",
        id: "graduationDate",
        filterFn: dateFilterFn,
      },
      course: {
        cell: info => info.getValue(),
        header: "Course",
        id: "course",
        sortingFn: "text",
      },
      lookingFor: {
        cell: info => info.getValue(),
        header: "Looking For",
        id: "lookingFor",
        sortingFn: "text",
      },
      skills: {
        cell: info => info.getValue().join(", "),
        header: "Skills",
        id: "skills",
        enableSorting: false,
        filterFn: arrayFilterFn,
      },
      interests: {
        cell: info => info.getValue().join(", "),
        header: "Interests",
        id: "interests",
        enableSorting: false,
        filterFn: arrayFilterFn,
      },
      updatedAt: {
        cell: info => (
          <time suppressHydrationWarning={true}>
            {formatDistanceToNowStrict(info.getValue(), { addSuffix: true })}{" "}
          </time>
        ),
        header: "Updated",
        id: "updatedAt",
        sortingFn: "datetime",
        enableColumnFilter: false,
      },
    }

    for (let column of nonFilterable) {
      if (columnDefsMap[column]) {
        columnDefsMap[column]!.enableColumnFilter = false
      }
    }

    return Object.entries(columnDefsMap).map(([columnName, columnDef]) =>
      columnHelper.accessor(columnName as ColumnName, columnDef),
    )
  }, [nonFilterable])

  const initialColumnVisibility = useMemo(() => {
    const initialColumnVisibility_: Partial<Record<ColumnName, boolean>> = {}
    for (const columnDef of columnDefs) {
      initialColumnVisibility_[columnDef.accessorKey as ColumnName] = false
    }
    initialColumns.forEach(column => (initialColumnVisibility_[column] = true))
    return initialColumnVisibility_
  }, [columnDefs, initialColumns])

  return <TanstackTable data={students} columns={columnDefs} initialColumnVisibility={initialColumnVisibility} />
}

export default StudentTable
