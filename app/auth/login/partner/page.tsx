import { SuccessCallout } from "@/components/Callouts"
import Link from "@/components/Link"

import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { Button, Flex, Heading, Separator, Text, TextField } from "@radix-ui/themes"
import Image from "next/image"
import React from "react"

const LoginPage = async () => {
  return (
    <Flex pl="9" pr="9" direction="column" gap="4" align="center" justify="center">
      <Heading as="h1">Partner Sign In</Heading>
      <Text>Enter your email address below:</Text>
      <Separator size="4" mt="3" mb="3" />
      <SuccessCallout message="Check your inbox for a link to sign in" style={{ width: "100%" }} />
      <TextField.Root placeholder="someone@example.com" style={{ width: "100%" }}>
        <TextField.Slot>
          <EnvelopeClosedIcon height="16" width="16" />
        </TextField.Slot>
      </TextField.Root>

      <Button size="3" style={{ width: "100%" }}>
        Sign In With Magic Link
      </Button>
    </Flex>
  )
}

export default LoginPage
