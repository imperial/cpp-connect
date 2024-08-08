"use server"

import { auth } from "@/auth"

import prisma from "../db"
import { restrictCompany } from "../rbac"
import { ServerSideFormHandler } from "../types"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const createCompany: ServerSideFormHandler = async (prevState, formData) => {
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
    await prisma.companyProfile.create({
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

export const createCompanyUser: ServerSideFormHandler = async (prevState, formData) => {
  const session = await auth()
  if (!session) {
    return { message: "You must be logged in to perform this action.", status: "error" }
  }
  const email = formData.get("email")
  const companyId = parseInt(formData.get("companyId")?.toString() ?? "-1")
  if (!email) {
    return { message: "Email is required.", status: "error" }
  }

  // Query for the user in the database to get asscoiatedCompanyId
  const user = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      associatedCompanyId: true,
      role: true,
    },
  })
  if (!session.user?.role || !restrictCompany(user, companyId)) {
    return { message: "Operation denied - unauthorised.", status: "error" }
  }

  // Create the user
  try {
    await prisma.user.create({
      data: {
        email: email.toString(),
        role: Role.COMPANY,
        associatedCompanyId: companyId,
      },
    })
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("email")) {
      return { message: "A user with that email already exists. Please supply a different email.", status: "error" }
    } else {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }
  }

  return {
    status: "success",
  }
}
