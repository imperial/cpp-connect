import { auth } from "@/auth"
import getCompanySlug from "@/lib/getCompanySlug"
import getStudentShortcode from "@/lib/getStudentShortcode"
import getUserAvatar from "@/lib/getUserAvatar"

import Navbar from "./Navbar"

import { Role } from "@prisma/client"
import React from "react"

const NavbarWrapper = async () => {
  const session = await auth()

  const userRole = session?.user?.role

  switch (userRole) {
    case Role.ADMIN:
      return <Navbar role={userRole} />
    case Role.COMPANY:
      const slug = (await getCompanySlug(session?.user!)) || ""
      return <Navbar role={userRole} slug={slug} />
    case Role.STUDENT:
      const shortcode = (await getStudentShortcode(session?.user!)) || ""
      const avatar = (await getUserAvatar(session?.user!)) || ""
      return <Navbar avatar={avatar} role={userRole} shortcode={shortcode} />
    default:
      return <Navbar />
  }
}

export default NavbarWrapper
