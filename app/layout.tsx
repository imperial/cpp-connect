import { Client } from "@/components/Client"
import NavbarWrapper from "@/components/NavbarWrapper"
import Footer from "@/components/Footer"
import "@/styling/globals.scss"

import { Theme, ThemePanel } from "@radix-ui/themes"
import { Box, Flex } from "@radix-ui/themes"
import "@radix-ui/themes/components.css"
import "@radix-ui/themes/tokens/base.css"
import "@radix-ui/themes/utilities.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"
import { ReactNode } from "react"

// Next object for information in the HTML head
export const metadata: Metadata = {
  title: "CPP Connect",
  description: "Connecting quality Imperial students with quality employers",
}

const inter = Inter({ subsets: ["latin"] })

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme accentColor="blue" grayColor="gray">
          <ThemePanel defaultOpen={false} />
          <Client>
            <NavbarWrapper />
            <Flex className="page-container" align="center" justify="center" direction="column" height="100%">
              <Box className="page-content">{children}</Box>
            </Flex>
          </Client>
          <Footer />
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
