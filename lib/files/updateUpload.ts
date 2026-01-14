import { FileCategory, FormPassBackState } from "@/lib/types"

import { deleteFile } from "./deleteFile"
import { getFileExtension, isFileNotEmpty, saveFile } from "./saveFile"

import { randomBytes } from "crypto"

/**
 * Updates an existing file upload.
 * @param file The new file to upload.
 * @param folder The folder to save the file in.
 * @param category The category of the file.
 * @param getOldPath A function that returns the path of the old file.
 * @param setNewPath A function that updates the path of the file in the database.
 * @returns An object with an error message and status.
 *
 * @example
 *  const res = await updateUpload(
      cv,
      "cvs",
      FileCategory.DOCUMENT,
      async () =>
        (
          await prisma.studentProfile.findUnique({
            where: { userId: studentId },
            select: { cv: true },
          })
        )?.cv,
      async path =>
        await prisma.studentProfile.update({
          where: { userId: studentId },
          data: { cv: path },
        }),
    )
 */
export const updateUpload = async (
  file: File,
  folder: string,
  category: FileCategory,
  getOldPath: () => Promise<string | null | undefined>,
  setNewPath: (path: string) => Promise<any>,
): Promise<FormPassBackState> => {
  if (await isFileNotEmpty(file)) {
    const filePath = `${folder}/${randomBytes(16).toString("hex")}.${await getFileExtension(file)}`

    // Save the new file to the file system
    try {
      await saveFile(filePath, file, category)
    } catch (e: any) {
      return { message: e?.cause, status: "error" }
    }

    // Delete old file if it exists
    try {
      const oldPath = await getOldPath()
      if (oldPath) {
        await deleteFile(oldPath)
      }
    } catch (e: any) {
      return { message: "An error occurred while deleting a file. Please try again later.", status: "error" }
    }

    // Update the database with the new file
    try {
      await setNewPath(filePath)
    } catch (e: any) {
      return { message: "A database error occurred. Please try again later.", status: "error" }
    }
  }

  return { message: "File updated successfully.", status: "success" }
}
