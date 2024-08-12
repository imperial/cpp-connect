"use client"

import { signInWithMagicLink } from "@/lib/authActions"
import { decodeSignInToken } from "@/lib/util/signInTokens"

import { ErrorCallout } from "./Callouts"

import { CrossCircledIcon } from "@radix-ui/react-icons"
import { Callout } from "@radix-ui/themes"
import { signIn, signOut, useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import React from "react"
import { useFormState } from "react-dom"

/**
 * Sign in/Sign out buttons
 */
const Auth = () => {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [formState, formAction] = useFormState(signInWithMagicLink, { message: "" })
  const token = searchParams.get("token")
  return session?.user ? (
    <>
      Signed in as {session.user.email} with role {session.user.role} <br />
      <button onClick={() => signOut()}>Sign out</button>
    </>
  ) : (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
      <form action={formAction}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={!!token ? decodeSignInToken(token ?? "") : ""}
        />
        <button type="submit">Sign In with magic link</button>
      </form>
      {formState?.status === "error" && formState?.message && <ErrorCallout message={formState.message} />}
    </>
  )
}

export default Auth
