import { auth } from "@/lib/auth"
import { validateFileOwner } from "@/lib/tasks"

import fs from "fs/promises"
import mime from "mime-types"
import { NextRequest, NextResponse } from "next/server"
import path from "path"

/**
 * Upon request: return the file provided under the file parameter\
 * Usage: Get /api/uploads?file=example.png
 */
export const GET = async (req: NextRequest) => {
  const session = await auth()
  const fileName = req.nextUrl.searchParams.get("file")

  // If environment variable UPLOAD_DIR not set, then can't tell where uploads will be
  if (!process.env.UPLOAD_DIR) {
    return Response.json({ message: "UPLOAD_DIR not set" }, { status: 500 })
  }
  // Handle no filename passed in params
  if (!fileName) {
    return Response.json({ message: "No file specified" }, { status: 400 })
  }

  // Check authorisation of user
  if (!(await validateFileOwner(session, fileName))) {
    return Response.json({ message: "Unauthorised" }, { status: 401 })
  }

  const filePath = path.join(process.env.UPLOAD_DIR, fileName)

  try {
    const fileBuffer = await fs.readFile(filePath)
    // Lookup type of file for the web browser to display it
    const mimeType = mime.lookup(filePath)

    if (!mimeType) {
      return Response.json({ message: "Could not recognise file type" }, { status: 400 })
    }

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
      },
      status: 200,
    })
  } catch (error) {
    return Response.json({ message: "File not found" }, { status: 404 })
  }
}
