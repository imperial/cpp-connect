import prisma from "@/lib/db"

import { Session } from "next-auth"

/**
 * Get the avatar of the session user
 * @param user The session user
 */
const getUserAvatar = async (user: Session["user"] | { id: string }) => {
  return (
    await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        image: true,
      },
    })
  )?.image
}

export default getUserAvatar
