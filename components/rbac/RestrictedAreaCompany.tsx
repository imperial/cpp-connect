import prisma from "@/lib/db"

import RestrictedArea from "./RestrictedArea"

import { Role } from "@prisma/client"
import { Session } from "next-auth"
import React from "react"

export const checkCompany = (companyId: number) => async (session: Session) => {
  if (!session?.user?.id) {
    return false
  }
  const userDB = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
      associatedCompanyId: companyId,
    },
  })
  return !!userDB
}

const RestrictedAreaCompany = ({
  children,
  companyId,
  showMessage,
}: {
  children: React.ReactNode
  companyId: number
  showMessage?: boolean
}) => {
  return (
    <RestrictedArea showMessage={showMessage} allowedRoles={[Role.COMPANY]} additionalCheck={checkCompany(companyId)}>
      {children}
    </RestrictedArea>
  )
}

export default RestrictedAreaCompany
