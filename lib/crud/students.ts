"use server"

import { studentOnlyAction } from "@/lib/rbac"

import prisma from "../db"
import { updateUpload } from "../files/updateUpload"
import getStudentShortcode from "../getStudentShortcode"
import { FileCategory, FormPassBackState } from "../types"
import { OpportunityType } from "@prisma/client"
import { revalidatePath } from "next/cache"

/**
 * Asserts that the value is a valid OpportunityType
 * @param value The value to check
 */
const validateIsOpportunityType = (value: string | undefined): value is OpportunityType | undefined =>
  value === undefined || Object.keys(OpportunityType).includes(value || "")

export const updateStudent = studentOnlyAction(
  async (_: FormPassBackState, formData: FormData, studentId: string): Promise<FormPassBackState> => {
    const course = formData.get("course")?.toString().trim()
    const gradMonth = formData.get("gradMonth")?.toString().trim()
    const gradYear = formData.get("gradYear")?.toString().trim()
    const cv = formData.get("cv") as File
    const avatar = formData.get("avatar") as File
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

    let graduationDate = gradMonth && gradYear ? new Date(`${gradMonth} ${gradYear}`) : undefined
    if (graduationDate && isNaN(graduationDate.getTime())) {
      return { message: "Invalid graduation date", status: "error" }
    }

    // Now update the student in the database
    try {
      await prisma.studentProfile.update({
        where: { userId: studentId },
        data: {
          course,
          lookingFor,
          bio,
          github,
          linkedIn,
          graduationDate,
          personalWebsite: website,
          skills,
          interests,
        },
      })
    } catch (e: any) {
      console.error(e)
      return { message: "A database error occured. Please try again later.", status: "error" }
    }

    const cvUpdateRes = await updateUpload(
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
    if (cvUpdateRes.status === "error") return cvUpdateRes

    const avatarUpdateRes = await updateUpload(
      avatar,
      "avatars",
      FileCategory.IMAGE,
      async () =>
        (
          await prisma.user.findUnique({
            where: { id: studentId },
            select: { image: true },
          })
        )?.image,
      async path =>
        await prisma.user.update({
          where: { id: studentId },
          data: { image: path },
        }),
    )
    if (avatarUpdateRes.status === "error") return avatarUpdateRes

    revalidatePath(`/students/${await getStudentShortcode({ id: studentId })}`)

    return {
      status: "success",
      message: "Profile updated successfully",
    }
  },
)
