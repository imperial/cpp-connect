import { validateFilePath } from "./saveFile"

import { promises as fs } from "fs"
import { join } from "path"

/**
 * Delete a file in the file system
 * @param filePath The path in the volume of the file
 */
export const deleteFile = async (filePath: string) => {
  if (!process.env.UPLOAD_DIR) {
    throw new Error("UPLOAD_DIR not set", {
      cause: "The server is not configured to store files",
    })
  }

  // Validate the file and path
  validateFilePath(filePath)

  // check if the file exists
  const fileExists = await fs.stat(join(process.env.UPLOAD_DIR, filePath)).catch(() => false)

  if (fileExists) {
    // delete the file if it exists
    try {
      await fs.unlink(join(process.env.UPLOAD_DIR, filePath))
    } catch (e: any) {
      throw new Error("Failed to delete file", {
        cause: e,
      })
    }
  }
}
