"use client"

import Link from "@/components/Link"

import { Button, Flex, Heading, Text } from "@radix-ui/themes"
import { useSearchParams } from "next/navigation"
import { FaCircleXmark } from "react-icons/fa6"

const SUPPORT_EMAIL = "doc-edtech@imperial.ac.uk"

enum Error {
  Configuration = "Configuration",
  AccessDenied = "AccessDenied",
  Verification = "Verification",
  Default = "Default",
}

const errorMap = {
  [Error.Configuration]: (
    <Text>
      There was a problem when trying to authenticate. <br />
      Please contact us if this error persists. <br />
    </Text>
  ),
  [Error.AccessDenied]: (
    <Flex direction="row" gap="4" wrap="wrap">
      <Text>
        Only members of DoC & our partners can access this portal. <br />
        If you believe that you should have access, please contact us at{" "}
        <Link href={`mailto:${SUPPORT_EMAIL}`} target="_blank">
          {SUPPORT_EMAIL}
        </Link>
        .<br />
      </Text>
    </Flex>
  ),
  [Error.Verification]: (
    <Text>
      Link expired or already used. <br />
      Please request a new one.
    </Text>
  ),
  [Error.Default]: <>Generic Authentication Error. Sorry :(</>,
}

const titleMap = {
  [Error.Configuration]: "Server Configuration Error",
  [Error.AccessDenied]: "Access Denied",
  [Error.Verification]: "Verification Error",
  [Error.Default]: "Error",
}

export default function AuthErrorPage() {
  const search = useSearchParams()
  const error = search.get("error") as Error

  return (
    <Flex gap="5" direction="column">
      <Flex direction="row" style={{ color: "var(--red-9)" }} gap="2">
        <FaCircleXmark size={24} style={{ marginTop: "6px" }} />
        <Heading as="h2">{titleMap[error] || "Error"}</Heading>
      </Flex>
      <Text>
        There was an error when trying to authenticate. Please contact us at{" "}
        <Link href={`mailto:${SUPPORT_EMAIL}`} target="_blank">
          {SUPPORT_EMAIL}
        </Link>{" "}
        if this error persists.
      </Text>
      <Flex gap="1" direction="column">
        <Heading as="h4">About this error:</Heading>
        <>{errorMap[error] || "Unknown Server error"}</>
      </Flex>
      <Button size="3" style={{ width: "100%", textDecoration: "none" }} variant="outline" asChild>
        <Link href="/auth/login">Back to Login</Link>
      </Button>
    </Flex>
  )
}
