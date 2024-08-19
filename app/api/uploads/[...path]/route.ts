import { auth } from "@/auth"
import { validateFilePath } from "@/lib/files/saveFile"

import fs from "fs/promises"
import mime from "mime-types"
import { NextRequest } from "next/server"
import path from "path"

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
