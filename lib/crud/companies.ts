"use server"

import { auth } from "@/auth"
import { FormPassBackState } from "@/lib/types"

import prisma from "../db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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

export const deleteCompany = async (
  prevState: FormPassBackState,
  formData: FormData,
  name: string,
): Promise<FormPassBackState> => {
  console.log(name)

  const enteredName = formData.get("name")?.toString().trim()
  if (!enteredName) {
    return { message: "Enter the company name to confirm deletion.", status: "error" }
  }
  if (enteredName.toLowerCase() !== name.toLowerCase()) {
    return { message: "Entered name did not match company name. Please try again.", status: "error" }
  }

  // Now add the company to the database
  try {
    await prisma.companyProfile.delete({
      where: { name },
    })
  } catch (e: any) {
    return { message: "A database error occured. Please try again later.", status: "error" }
  }

  redirect("/companies")
}
