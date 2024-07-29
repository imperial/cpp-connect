"use client"

import { SessionProvider } from "next-auth/react"
import React from "react"

/**
 * Wrap children in SessionProvider.\
 * This separates client logic allowing parent to be a server component.
 */
export const Client = ({ children }: { children: React.ReactNode }) => <SessionProvider>{children}</SessionProvider>
