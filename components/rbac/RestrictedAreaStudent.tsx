import RestrictedArea from "./RestrictedArea"

import { Role } from "@prisma/client"
import { Session } from "next-auth"
import React from "react"

const checkStudent = (studentId: string) => async (session: Session) =>
  !!session?.user.id && session.user.id === studentId

const RestrictedAreaStudent = ({
  children,
  studentId,
  showMessage,
}: {
  children: React.ReactNode
  studentId: string
  showMessage?: boolean
}) => {
  return (
    <RestrictedArea showMessage={showMessage} allowedRoles={[Role.STUDENT]} additionalCheck={checkStudent(studentId)}>
      {children}
    </RestrictedArea>
  )
}

export default RestrictedAreaStudent
