"use client"

import DesktopNavbar from "@/components/navbar/DesktopNavbar"

import MobileNavbar from "./MobileNavbar"

import { Role } from "@prisma/client"
import { Session } from "next-auth"
import React from "react"
import { useMediaQuery } from "react-responsive"

const MOBILE_WIDTH = 1000

interface BaseNavbarProps {
  role: Role
  avatar: string
}

interface AdminNavbarProps extends BaseNavbarProps {
  role: "ADMIN"
}

interface StudentNavbarProps extends BaseNavbarProps {
  role: "STUDENT"
  shortcode: string
}

interface CompanyNavbarProps extends BaseNavbarProps {
  role: "COMPANY"
  slug: string
}

export const isSignedIn = (data: Session | null, props: NavbarProps): props is RoleNavbarProps => !!(data && data.user)

export type RoleNavbarProps = StudentNavbarProps | CompanyNavbarProps | AdminNavbarProps

export type NavbarProps = RoleNavbarProps | {}

const Navbar = (props: NavbarProps) =>
  useMediaQuery({ query: `(max-width: ${MOBILE_WIDTH}px)` }) ? (
    <MobileNavbar {...props} />
  ) : (
    <DesktopNavbar {...props} />
  )

export default Navbar
