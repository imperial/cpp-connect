import prisma from "@/lib/db"

import { Session } from "next-auth"

/**
 * Get the student shortcode of the session user for the profile link
 * @param user The session user
 */
const getStudentShortcode = async (user: Session["user"] | { id: string }) => {
  return (
    await prisma.studentProfile.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        studentShortcode: true,
      },
    })
  )?.studentShortcode
}

export default getStudentShortcode
