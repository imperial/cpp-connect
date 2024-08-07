import { auth } from "@/auth"

import { Role } from "@prisma/client"
import React from "react"

/**
 * Make children only be available to certain roles.
 * @param children The children to display if the user is authenticated and has the correct role.
 * @param allowedRoles (default []) The roles that are allowed to access the children. Note: ADMIN is always allowed and should not be passed explicitly.
 * @param showMessage (default true) Whether to show a message if the user is not authenticated or does not have the correct role.
 */
const RestrictedArea = async ({
  children,
  allowedRoles = [],
  showMessage = true,
}: {
  children: React.ReactNode
  allowedRoles?: Role[]
  showMessage?: boolean
}) => {
  const session = await auth()

  if (!session) {
    return showMessage ? <p>Not authenticated.</p> : <></>
  }

  // Allow ADMIN to access all restricted areas
  if (session.user.role === "ADMIN" || allowedRoles.includes(session.user.role)) {
    return <>{children}</>
  }

  return showMessage ? <p>Not authorised.</p> : <></>
}

export default RestrictedArea
