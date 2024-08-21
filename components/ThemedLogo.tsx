"use client"

import { useTheme } from "next-themes"
import Image from "next/image"

const ThemedLogo = () => {
  const { resolvedTheme } = useTheme()
  let src

  if (resolvedTheme === "dark") {
    src = "/images/imperial-logo.svg"
  } else {
    src = "/images/imperial-logo-blue.svg"
  }

  return <Image src={src} alt="imperial logo" width={0} height={0} />
}

export default ThemedLogo
