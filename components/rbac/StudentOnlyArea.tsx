import { auth } from "@/auth"

import React from "react"

const StudentOnlyArea = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (!session) {
    return <p>Not authenticated.</p>
  }

  if (!(session.user.role === "COMPANY" || session.user.role === "ADMIN")) {
    return <p>Unauthorised</p>
  }

  return <>{children}</>
}

export default StudentOnlyArea
