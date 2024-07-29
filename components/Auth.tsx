"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import React from "react"

/**
 * Sign in/Sign out buttons
 */
const Auth = () => {
  const { data: session } = useSession()
  return session?.user ? (
    <>
      Signed in as {session.user.email} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  ) : (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default Auth
