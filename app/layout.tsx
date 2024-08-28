import { Client } from "@/components/Client"
import Footer from "@/components/Footer"
import NavbarWrapper from "@/components/navbar/NavbarWrapper"
import { CONTENT_ID } from "@/components/util/constants"
import "@/styling/globals.scss"

import { Theme } from "@radix-ui/themes"
import { Box, Flex } from "@radix-ui/themes"
import "@radix-ui/themes/components.css"
import "@radix-ui/themes/tokens/base.css"
import "@radix-ui/themes/utilities.css"
import { Metadata, Viewport } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import Head from "next/head"
import { ReactNode } from "react"

// Next object for information in the HTML head
export const metadata: Metadata = {
  title: "CPP Connect",
  description: "Connecting quality Imperial students with quality employers",
  applicationName: "CPP Connect",
  appleWebApp: {
    title: "CPP Connect",
  },
  manifest: "/site.webmanifest",

  // icons for all devices & platforms
  icons: {
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    icon: [
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },

  // rich previews
  openGraph: {
    title: "CPP Connect",
    description: "Connecting quality Imperial students with quality employers",
    url: "https://cpp.doc.ic.ac.uk/",
    siteName: "CPP Connect",
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "CPP Connect",
    description: "Connecting quality Imperial students with quality employers",
    site: "@ICComputing",
    creator: "@ICComputing",
  },

  // other stuff
  other: {
    "msapplication-TileColor": "#0000cd",
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
}

const inter = Inter({ subsets: ["latin"] })

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
  return (
    <html lang="en">
      <Head>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0000cd" />
      </Head>
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <Theme accentColor="blue" grayColor="gray">
            <Client>
              <Flex direction="column" justify="between" minHeight="100vh">
                <NavbarWrapper />
                <Flex
                  id={CONTENT_ID}
                  className="page-container"
                  align="center"
                  direction="column"
                  height="100%"
                  flexGrow="1"
                >
                  <Box className="page-content">{children}</Box>
                </Flex>
                <Footer />
              </Flex>
            </Client>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
