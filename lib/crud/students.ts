"use server"

import prisma from "../db"
import { deleteFile } from "../deleteFile"
import getStudentShortcode from "../getStudentShortcode"
import { getFileExtension, isFileNotEmpty, saveFile } from "../saveFile"
import { FileCategory, FormPassBackState } from "../types"
import { OpportunityType } from "@prisma/client"
import { randomBytes } from "crypto"
import { revalidatePath } from "next/cache"

/**
 * Asserts that the value is a valid OpportunityType
 * @param value The value to check
 */
const validateIsOpportunityType = (value: string | undefined): value is OpportunityType | undefined =>
  value === undefined || Object.keys(OpportunityType).includes(value || "")

export const updateStudent = async (
  prevState: FormPassBackState,
  formData: FormData,
  userId: string,
): Promise<FormPassBackState> => {
  // TODO: Add restriction to only allow students to update their own profiles

  const course = formData.get("course")?.toString().trim()
  const gradMonth = formData.get("gradMonth")?.toString().trim()
  const gradYear = formData.get("gradYear")?.toString().trim()
  const cv = formData.get("cv") as File
  const lookingFor = formData.get("lookingFor")?.toString().trim() || undefined // dropdown default value is ""
  const bio = formData.get("bio")?.toString().trim()
  let skills = formData.get("skills")?.toString().trim()
  let interests = formData.get("interests")?.toString().trim()
  const website = formData.get("website")?.toString().trim()
  const github = formData.get("github")?.toString().trim()
  const linkedIn = formData.get("linkedIn")?.toString().trim()

  try {
    if (skills) {
      skills = JSON.parse(skills)
    }
    if (interests) {
      interests = JSON.parse(interests)
    }
  } catch (e: any) {
    return { message: "Invalid skills or interests", status: "error" }
  }

  if (!Array.isArray(skills) || !Array.isArray(interests)) {
    return { message: "Invalid skills or interests", status: "error" }
  }

  if (!validateIsOpportunityType(lookingFor)) {
    return { message: "Invalid looking for value", status: "error" }
  }

  const graduationDate = gradMonth && gradYear ? new Date(`${gradMonth} ${gradYear}`) : undefined

  // Now update the student in the database
  try {
    await prisma.studentProfile.update({
      where: { userId },
      data: { course, lookingFor, bio, github, linkedIn, graduationDate, personalWebsite: website, skills, interests },
    })
  } catch (e: any) {
    console.error(e)
    return { message: "A database error occured. Please try again later.", status: "error" }
  }

  revalidatePath(`/students/${await getStudentShortcode({ id: userId })}`)

  // Save the cv (if it exists)
  if (isFileNotEmpty(cv)) {
    const cvPath = `cvs/${randomBytes(16).toString("hex")}.${getFileExtension(cv)}`

    // save the new cv to the file system
    try {
      await saveFile(cvPath, cv, FileCategory.DOCUMENT)
    } catch (e: any) {
      return { message: e?.cause, status: "error" }
    }

    // delete old cv if it exists
    try {
      const oldCv = await prisma.studentProfile.findUnique({
        where: { userId },
        select: { cv: true },
      })
      if (oldCv?.cv) {
        await deleteFile(oldCv.cv)
      }
    } catch (e: any) {
      return { message: "An error occured while deleting the old cv. Please try again later.", status: "error" }
    }

    // update the student profile with the new cv
    try {
      await prisma.studentProfile.update({
        where: { userId },
        data: { cv: cvPath },
      })
    } catch (e: any) {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }
  }

  return {
    status: "success",
  }
}
