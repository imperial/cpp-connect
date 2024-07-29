import imperialLogo from "@/public/imperial-logo.svg"

import { Flex } from "@radix-ui/themes"
import Image from "next/image"
import React from "react"

const Navbar = () => {
  return (
    <Flex width="100vw" direction="row">
      <p style={{ display: "inline" }}>Navbar</p>
      <Image src="/imperial-logo.svg" alt="imperial logo" width={213} height={66} />
    </Flex>
  )
}

export default Navbar
