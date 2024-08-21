"use client"

import { decodeSignInToken } from "@/lib/util/signInTokens"

import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { Button, Flex, Heading, Separator, Spinner, Text, TextField } from "@radix-ui/themes"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

const LoginPage = () => {
  const [isPending, startTransition] = useTransition()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  if (!isClient) {
    return (
      <Flex direction="row" gap="3">
        <Spinner />
        Loading
      </Flex>
    )
  }

  const signInEmail = async (data: FormData) => {
    const email = data.get("email")

    if (!email) {
      return
    }

    startTransition(async () => {
      await signIn("nodemailer", { email })
    })
  }

  return (
    <Flex pl="9" pr="9" direction="column" gap="3" align="center" justify="center" asChild>
      <form action={signInEmail}>
        <Heading as="h1">Partner Sign In</Heading>
        <Text>Enter your email address below:</Text>
        <Separator size="4" mt="3" mb="3" />

        <TextField.Root
          size="3"
          placeholder="someone@example.com"
          style={{ width: "100%" }}
          name="email"
          type="email"
          required
          defaultValue={!!token ? decodeSignInToken(token ?? "") : ""}
        >
          <TextField.Slot>
            <EnvelopeClosedIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>

        <Button size="3" style={{ width: "100%" }}>
          {isPending ? <Spinner /> : "Sign in with magic link"}
        </Button>
      </form>
    </Flex>
  )
}

export default LoginPage
