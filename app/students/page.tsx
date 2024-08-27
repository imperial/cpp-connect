import StudentTable from "@/app/students/StudentTable"
import prisma from "@/lib/db"

import { Flex, Heading } from "@radix-ui/themes"
import React from "react"

const StudentsPage = async () => {
  const students = await prisma.studentProfile.findMany({
    select: {
      user: {
        select: {
          name: true,
          image: true,
          role: true,
        },
      },
      graduationDate: true,
      course: true,
      studentShortcode: true,
      lookingFor: true,
      skills: true,
      interests: true,
      updatedAt: true,
    },
  })
  return (
    <Flex direction="column" gap="5" align="center" width="100%">
      <Heading size="8">Students</Heading>
      <StudentTable
        students={students}
        initialColumns={["user.name", "interests", "skills", "updatedAt", "graduationDate"]}
      />
    </Flex>
  )
}

export default StudentsPage
