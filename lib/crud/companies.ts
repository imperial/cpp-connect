"use server"

import { auth } from "@/auth"

import prisma from "../db"
import { revalidatePath } from "next/cache"

export interface FormPassBackState {
  message?: string
  status?: "success" | "error"
}

export const createCompany = async (prevState: FormPassBackState, formData: FormData): Promise<FormPassBackState> => {
  const session = await auth()
  if (!session) {
    return { message: "You must be logged in to perform this action.", status: "error" }
  }
  if (!session.user?.role || session.user.role !== "ADMIN") {
    return { message: "Unauthorised.", status: "error" }
  }

  // Validate things
  const name = formData.get("name")?.toString().trim()
  const website = formData.get("website")?.toString().trim()
  const sector = formData.get("sector")?.toString().trim()

  if (!name) {
    return { message: "Name is required.", status: "error" }
  }

  if (!website) {
    return { message: "Website is required.", status: "error" }
  } else {
    try {
      new URL(website.toString())
    } catch (_) {
      return { message: "Invalid website URL.", status: "error" }
    }
  }

  if (!sector) {
    return { message: "Sector is required.", status: "error" }
  }

  // Now add the company to the database
  try {
    const res = await prisma.companyProfile.create({
      data: { name, website, sector },
    })
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("name")) {
      return { message: "Company already exists. Please supply a different name.", status: "error" }
    } else {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }
  }

  revalidatePath("/companies")

  return {
    status: "success",
  }
}

export const updateCompany = async (
  prevState: FormPassBackState,
  formData: FormData,
  id: number,
): Promise<FormPassBackState> => {
  const session = await auth()
  if (!session) {
    return { message: "You must be logged in to perform this action.", status: "error" }
  }
  if (!session.user?.role || session.user.role !== "ADMIN") {
    return { message: "Unauthorised.", status: "error" }
  }
  // Validate things
  const name = formData.get("name")?.toString().trim()
  const summary = formData.get("summary")?.toString().trim()
  const website = formData.get("website")?.toString().trim()
  const sector = formData.get("sector")?.toString().trim()
  const size = formData.get("size")?.toString().trim()
  const hq = formData.get("hq")?.toString().trim()
  const email = formData.get("email")?.toString().trim()
  const phone = formData.get("phone")?.toString().trim()
  const founded = formData.get("founded")?.toString().trim()

  if (!name) {
    return { message: "Name is required.", status: "error" }
  }

  if (!website) {
    return { message: "Website is required.", status: "error" }
  } else {
    try {
      new URL(website.toString())
    } catch (_) {
      return { message: "Invalid website URL.", status: "error" }
    }
  }

  if (!sector) {
    return { message: "Sector is required.", status: "error" }
  }

  // Now update the company in the database
  try {
    await prisma.companyProfile.update({
      where: { id },
      data: { name, summary, website, sector, size, hq, email, phone, founded },
    })
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("name")) {
      return { message: "Company already exists. Please supply a different name.", status: "error" }
    } else {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }
  }

  revalidatePath(`/companies/${id}`)

  return {
    status: "success",
  }
}
