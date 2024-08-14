import { FileCategory } from "@/lib/types"

import { promises as fs } from "fs"
import { join } from "path"
import path from "path"

const MAX_FILE_SIZE = 1024 * 1024 * 4

const allowedImageTypes = ["image/png", "image/jpeg", "image/gif"]
const allowedDocumentTypes = ["application/pdf", "text/plain"]

/**
 * Save a file to the file system
 * @param filePath The path in the volume to save the file
 * @param file The file to save
 * @param fileType The desired type of file to save
 */
export const saveFile = async (filePath: string, file: File, fileType: FileCategory) => {
  if (!process.env.UPLOAD_DIR) {
    throw new Error("UPLOAD_DIR not set", {
      cause: "The server is not configured to save files",
    })
  }

  // Validate the file and path
  validateFile(file, fileType)
  validateFilePath(filePath)

  await fs.writeFile(join(process.env.UPLOAD_DIR, filePath), Buffer.from(await file.arrayBuffer()))
}

/**
 * Validate that a file path is safe
 * @param filePath The path to validate
 */
const validateFilePath = (filePath: string) => {
  // Normalize the path to move all the ../ to the front of the path
  // Apply regex to remove any ../ from the front of the path
  const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "")

  if (safePath !== filePath) {
    throw new Error("Invalid path", {
      cause: "The path provided is invalid",
    })
  }
}

/**
 * Validate a file
 * @param file The file to validate
 * @param fileType The desired type of file to validate
 */
const validateFile = (file: File, fileType: FileCategory) => {
  // Check file exists
  if (!isFileNotEmpty(file)) {
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
 * Check if a file is not empty.
 * Can be used to check if a file has been provided
 * @param file The file to check
 */
export const isFileNotEmpty = (file: File) => file.size > 0

/**
 * Get the file extension of a file
 * @param file The file to get the extension of
 * @example getFileExtension(<some png image>) => "png"
 */
export const getFileExtension = (file: File) => file.type.split("/")[1]
