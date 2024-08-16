import StudentTable from "@/app/students/StudentTable"
import prisma from "@/lib/db"

import React from "react"

const StudentsPage = async () => {
  const students = await prisma.studentProfile.findMany({
    select: {
      user: {
        select: {
          name: true,
          updatedAt: true,
          image: true,
          role: true,
        },
      },
      graduationDate: true,
      course: true,
      studentShortcode: true,
    },
  })
  return (
    <StudentTable
      students={students}
      columns={["user.image", "user.name", "course", "graduationDate", "user.updatedAt"]}
    />
  )
}

export default StudentsPage
