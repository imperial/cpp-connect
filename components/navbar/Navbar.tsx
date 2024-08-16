"use client"

import DesktopNavbar from "@/components/navbar/DesktopNavbar"

import { Role } from "@prisma/client"
import React, { useEffect, useState } from "react"

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

export type RoleNavbarProps = StudentNavbarProps | CompanyNavbarProps | AdminNavbarProps

export type NavbarProps = RoleNavbarProps | {}

const Navbar = (props: NavbarProps) => {
  const [width, setWidth] = useState(window.innerWidth)

  const handleWindowSizeChange = () => setWidth(window.innerWidth)

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [])

  const isMobile = width <= 768

  return isMobile ? <></> : <DesktopNavbar {...props} />
}

export default Navbar
