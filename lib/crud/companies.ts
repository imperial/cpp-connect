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
  const name = formData.get("name")
  const website = formData.get("website")
  const sector = formData.get("sector")

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
      data: {
        name: name.toString(),
        website: website.toString(),
        sector: sector.toString(),
      },
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
  const summary = formData.get("summary")
  const website = formData.get("website")
  const sector = formData.get("sector")
  const size = formData.get("size")
  const hq = formData.get("hq")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const founded = formData.get("founded")

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
    const res = await prisma.companyProfile.update({
      where: { id },
      data: {
        summary: summary?.toString(),
        website: website.toString(),
        sector: sector.toString(),
        size: size?.toString(),
        hq: hq?.toString(),
        email: email?.toString(),
        phone: phone?.toString(),
        founded: founded?.toString(),
      },
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
