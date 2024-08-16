import { auth } from "@/auth"
import getCompanySlug from "@/lib/getCompanySlug"

import { Card, Container, Flex } from "@radix-ui/themes"
import { redirect } from "next/navigation"
import React from "react"

const AuthPage = async ({ children }: { children: React.ReactNode }) => {
  // If logged in go to root, unless company in which case go to company profile
  const session = await auth()
  if (session) {
    switch (session.user.role) {
      case "COMPANY":
        return redirect(`/companies/${(await getCompanySlug(session.user)) ?? ""}`)
      default:
        return redirect("/")
    }
  }
  return (
    <Flex width="100%" height="100%" align="center" justify="center">
      <Container maxWidth="40rem">
        <Card variant="surface">
          <Flex direction="column" width="100%" height="100%" gap="3" p="3">
            {children}
          </Flex>
        </Card>
      </Container>
    </Flex>
  )
}

export default AuthPage
