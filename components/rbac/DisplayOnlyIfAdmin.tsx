import { auth } from "@/auth"

import React from "react"

/**
 * Area only admins can acess that is within a page, so instead of saying "Unauthorised" just displays nothing if not authenticated.
 */
const DisplayOnlyIfAdmin = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()

  if (session?.user.role === "ADMIN") {
    return <>{children}</>
  }

  return <></>
}

export default DisplayOnlyIfAdmin
