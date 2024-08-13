import { FileCategory } from "@/lib/types"

import { promises as fs } from "fs"
import { join } from "path"

const MAX_FILE_SIZE = 1024 * 1024 * 4

const allowedImageTypes = ["image/png", "image/jpeg", "image/gif"]
const allowedDocumentTypes = ["application/pdf", "text/plain"]

/**
 * Save a file to the file system
 * @param path The path in the volume to save the file
 * @param file The file to save
 * @param fileType The desired type of file to save
 */
export const saveFile = async (path: string, file: File, fileType: FileCategory) => {
  if (!process.env.UPLOAD_DIR) {
    throw new Error("UPLOAD_DIR not set", {
      cause: "The server is not configured to save files",
    })
  }
  // Validate the file
  validateFile(file, fileType)

  await fs.writeFile(join(process.env.UPLOAD_DIR, path), Buffer.from(await file.arrayBuffer()))
}

/**
 * Validate a file
 * @param file The file to validate
 * @param fileType The desired type of file to validate
 */
const validateFile = (file: File, fileType: FileCategory) => {
  // Check file exists
  if (!fileExists(file)) {
    throw new Error("No file provided", {
      cause: "The file provided is empty",
    })
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size too large", {
      cause: "The file provided is too large",
    })
  }

  // Check file type
  if (fileType === FileCategory.IMAGE && !allowedImageTypes.includes(file.type)) {
    throw new Error("Invalid file type", {
      cause: "The file provided is not an image",
    })
  }
  if (fileType === FileCategory.DOCUMENT && !allowedDocumentTypes.includes(file.type)) {
    throw new Error("Invalid file type", {
      cause: "The file provided is not a document",
    })
  }
}

/**
 * Check if a file exists
 * @param file The file to check
 */
export const fileExists = (file: File) => file.size > 0
