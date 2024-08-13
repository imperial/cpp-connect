import prisma from "@/lib/db"

import { Session } from "next-auth"

/**
 * Get the company slug of the company the session user belongs to
 * @param user The session user
 */
const getCompanySlug = async (user: Session["user"]) => {
  return (
    await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        associatedCompany: {
          slug: true,
        },
      },
    })
  )?.slug
}

export default getCompanySlug
