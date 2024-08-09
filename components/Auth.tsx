"use client"

import { signInWithMagicLink } from "@/lib/authActions"

import { CrossCircledIcon } from "@radix-ui/react-icons"
import { Callout } from "@radix-ui/themes"
import { signIn, signOut, useSession } from "next-auth/react"
import React from "react"
import { useFormState } from "react-dom"

/**
 * Sign in/Sign out buttons
 */
const Auth = () => {
  const { data: session } = useSession()
  const [formState, formAction] = useFormState(signInWithMagicLink, { message: "" })
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
        <input id="email" name="email" type="email" required />
        <button type="submit">Sign In with magic link</button>
      </form>
      {formState?.status === "error" && formState?.message && (
        <Callout.Root color="red">
          <Callout.Icon>
            <CrossCircledIcon />
          </Callout.Icon>
          <Callout.Text>{formState.message}</Callout.Text>
        </Callout.Root>
      )}
    </>
  )
}

export default Auth
