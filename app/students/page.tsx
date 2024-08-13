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
        },
      },
      graduationDate: true,
      course: true,
      studentShortcode: true,
    },
  })
  return <StudentTable students={students} />
}

export default StudentsPage
