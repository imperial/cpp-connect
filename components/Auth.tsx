"use client"

import { signInWithMagicLink } from "@/lib/authActions"

import { signIn, signOut, useSession } from "next-auth/react"
import React from "react"

/**
 * Sign in/Sign out buttons
 */
const Auth = () => {
  const { data: session } = useSession()
  return session?.user ? (
    <>
      Signed in as {session.user.email} with role {session.user.role} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  ) : (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
      <form action={signInWithMagicLink}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <button type="submit">Sign In with magic link</button>
      </form>
    </>
  )
}

export default Auth
