import { Client } from "@/components/Client"

import "./globals.css"

import { Theme } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"

// Next object for information in the HTML head
export const metadata: Metadata = {
  title: "CPP Connect",
  description: "Connecting quality Imperial students with quality employers",
}

const inter = Inter({ subsets: ["latin"] })

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>
          <Client>{children}</Client>
        </Theme>
      </body>
    </html>
  )
}

export default RootLayout
