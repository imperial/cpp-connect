import { auth } from "@/auth"
import Navbar from "@/components/navbar/Navbar"
import getCompanySlug from "@/lib/getCompanySlug"
import getStudentShortcode from "@/lib/getStudentShortcode"
import getUserAvatar from "@/lib/getUserAvatar"

import { Role } from "@prisma/client"
import React from "react"

const NavbarWrapper = async () => {
  const session = await auth()

  const userRole = session?.user?.role

  switch (userRole) {
    case Role.ADMIN:
      return <Navbar role={userRole} avatar="" />
    case Role.COMPANY:
      const slug = (await getCompanySlug(session?.user!)) || ""
      return <Navbar role={userRole} slug={slug} avatar="" />
    case Role.STUDENT:
      const shortcode = (await getStudentShortcode(session?.user!)) || ""
      const avatar = (await getUserAvatar(session?.user!)) || ""
      return <Navbar avatar={avatar} role={userRole} shortcode={shortcode} />
    default:
      return <Navbar />
  }
}

export default NavbarWrapper
