import { Client } from "@/components/Client"

import "./globals.css"

import { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
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
        <Client>{children}</Client>
      </body>
    </html>
  )
}

export default RootLayout
