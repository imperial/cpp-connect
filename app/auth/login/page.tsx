import { signIn } from "@/auth"
import Link from "@/components/Link"

import styles from "./page.module.scss"

import { Button, Flex, Separator, Text } from "@radix-ui/themes"
import { Heading } from "@react-email/components"
import { AuthError } from "next-auth"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import React from "react"
import { BsBoxArrowRight } from "react-icons/bs"

const ThemedLogo = dynamic(() => import("@/components/ThemedLogo"), { ssr: false })

const LoginPage = async ({ searchParams }: { searchParams?: { callbackUrl?: string } }) => {
  const signInEntraID = async () => {
    "use server"
    try {
      await signIn("microsoft-entra-id", {
        redirectTo: searchParams?.callbackUrl ?? "/",
      })
    } catch (error) {
      // Signin can fail for a number of reasons, such as the user
      // not existing, or the user not having the correct role.
      // In some cases, you may want to redirect to a custom error
      if (error instanceof AuthError) {
        return redirect(`/auth/error?error=${error.type}`)
      }

      // Otherwise if a redirects happens NextJS can handle it
      // so you can just re-thrown the error and let NextJS handle it.
      // Docs:
      // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
      throw error
    }
  }

  return (
    <Flex gap="6" direction="column">
      <Flex className={styles.logosContainer}>
        <ThemedLogo />
      </Flex>
      <Flex pl="9" pr="9" direction="column" gap="5">
        <Flex direction="column" justify="center" align="center">
          <Heading as="h1">CPP Connect</Heading>
          <Text>Giving you a head start in your career</Text>
        </Flex>
        <Separator size="4" />
        <Flex direction="column" gap="3">
          <form action={signInEntraID} style={{ width: "100%" }}>
            <Button size="3" style={{ width: "100%" }}>
              Login with SSO
              <BsBoxArrowRight />
            </Button>
          </form>
          <Link href="/auth/login/partner" style={{ textAlign: "center" }}>
            Industry Partner?
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LoginPage
