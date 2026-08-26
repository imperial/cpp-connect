"use client"

import dynamic from "next/dynamic"

/**
 * Client-side-only wrapper around {@link ThemedLogo}: the logo depends on the resolved theme,
 * which is only known in the browser. `ssr: false` is not allowed in Server Components,
 * so the dynamic import lives here.
 */
const ThemedLogoClient = dynamic(() => import("@/components/ThemedLogo"), { ssr: false })

export default ThemedLogoClient
