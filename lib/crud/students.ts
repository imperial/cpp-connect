"use server"

import prisma from "../db"
import getStudentShortcode from "../getStudentShortcode"
import { FormPassBackState } from "../types"
import { revalidatePath } from "next/cache"

export const updateStudent = async (
  prevState: FormPassBackState,
  formData: FormData,
  userId: string,
): Promise<FormPassBackState> => {
  // const res = await checkAuthorizedForStudentCRUD(id)

  // if (res.status === "error") {
  //   return res
  // }
  // Validate things

  const website = formData.get("website")?.toString().trim()

  // Now update the student in the database
  try {
    await prisma.studentProfile.update({
      where: { userId },
      data: { personalWebsite: website },
    })
  } catch (e: any) {
    return { message: "A database error occured. Please try again later.", status: "error" }
  }

  revalidatePath(`/students/${await getStudentShortcode({ id: userId })}`)

  return {
    status: "success",
  }
}
