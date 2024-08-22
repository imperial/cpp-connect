import { auth } from "@/auth"
import prisma from "@/lib/db"
import { validateFilePath } from "@/lib/files/saveFile"

import fs from "fs/promises"
import mime from "mime-types"
import { Session } from "next-auth"
import { NextRequest } from "next/server"
import path from "path"

/**
 * @param session The user's session
 * @param suffix The suffix of the file path
 * @returns A response if the user is unauthorised to view the requested CV, or "authorised" if they are authorised
 */
const checkAuthorisedForCV = async (session: Session, suffix: string): Promise<Response | "authorised"> => {
  // Only check for CVs
  if (suffix.split("/")[0] !== "cvs") {
    return "authorised"
  }

  // Only companies and admins can view any CV
  if (session.user.role === "COMPANY" || session.user.role === "ADMIN") {
    return "authorised"
  }

  // Students can only view their own CV
  if (session.user.role === "STUDENT") {
    const studentProfile = await prisma.studentProfile.findUnique({
      select: {
        cv: true,
      },
      where: {
        userId: session.user.id,
      },
    })

    if (!studentProfile) {
      return new Response("Student profile not found", { status: 404 })
    }

    if (suffix !== "/" + studentProfile.cv) {
      return new Response("Unauthorised to view this CV", { status: 403 })
    }

    return "authorised"
  }

  return new Response("Unexpected error", { status: 500 })
}

/**
 * Upon request: return the file provided at the path in the volume
 * @example GET /api/uploads/banner/myCompanyBanner.png
 */
export const GET = async (req: NextRequest) => {
  const session = await auth()

  // Any user can read any file
  if (!session) {
    return new Response("Not authenticated", { status: 401 })
  }

  // If environment variable UPLOAD_DIR not set, then can't tell where uploads will be
  if (!process.env.UPLOAD_DIR) {
    return new Response("UPLOAD_DIR not set", { status: 500 })
  }

  const suffix = req.nextUrl.pathname.slice("/api/uploads".length)

  if (!validateFilePath(suffix)) {
    return new Response("Invalid path", { status: 400 })
  }

  const res = await checkAuthorisedForCV(session, suffix)

  if (res !== "authorised") {
    return res
  }

  const filePath = path.join(process.env.UPLOAD_DIR, suffix)

  try {
    const fileBuffer = await fs.readFile(filePath)
    // Lookup type of file for the web browser to display it
    const mimeType = mime.lookup(filePath)

    if (!mimeType) {
      return new Response("Could not recognise file type", { status: 400 })
    }

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
      },
      status: 200,
    })
  } catch (error) {
    return new Response("File not found", { status: 404 })
  }
}
