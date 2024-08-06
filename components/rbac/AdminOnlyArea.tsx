import { auth } from "@/auth"

import React from "react"

/**
 * Area only students and admins can access
 */
const AdminOnlyArea = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (!session) {
    return <p>Not authenticated.</p>
  }

  if (session.user.role === "ADMIN") {
    return <p>{children}</p>
  }

  return <>Unauthorisation</>
}

export default AdminOnlyArea
