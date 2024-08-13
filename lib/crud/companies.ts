"use server"

import { auth } from "@/auth"

import prisma from "../db"
import { restrictCompany } from "../rbac"
import { FormPassBackState, ServerSideFormHandler } from "../types"
import { encodeSignInUrl } from "../util/signInTokens"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createCompany: ServerSideFormHandler = async (prevState, formData) => {
  const session = await auth()
  if (!session) {
    return { message: "You must be logged in to perform this action.", status: "error" }
  }
  if (!session.user?.role || session.user.role !== "ADMIN") {
    return { message: "Unauthorised.", status: "error" }
  }

  // Validate things
  const name = formData.get("name")?.toString().trim()
  const slug = formData.get("slug")?.toString().trim()
  const website = formData.get("website")?.toString().trim()
  const sector = formData.get("sector")?.toString().trim()

  if (!name) {
    return { message: "Name is required.", status: "error" }
  }

  if (!slug) {
    return { message: "Slug is required.", status: "error" }
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
        slug: slug.toString(),
        website: website.toString(),
        sector: sector.toString(),
      },
    })
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("slug")) {
      return {
        message:
          "A company with that slug already exists. Please supply a different slug, or change the company name and slug.",
        status: "error",
      }
    } else {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }
  }

  revalidatePath("/companies")

  return {
    status: "success",
  }
}

const checkAuthorizedForCompanyCRUD = async (companyId: number): Promise<FormPassBackState> => {
  const session = await auth()
  if (!session) {
    return { message: "You must be logged in to perform this action.", status: "error" }
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user?.id,
    },
    select: {
      associatedCompanyId: true,
      role: true,
    },
  })
  if (!restrictCompany(user, companyId)) {
    return { message: "Operation denied - unauthorised.", status: "error" }
  }
  return { status: "success" }
}

export const createCompanyUser: ServerSideFormHandler<FormPassBackState & { signInURL?: string }> = async (
  prevState,
  formData,
) => {
  const email = formData.get("email")?.toString().trim()
  const baseUrl = formData.get("baseUrl")?.toString().trim()
  const companyId = parseInt(formData.get("companyId")?.toString() ?? "-1")
  if (!email) {
    return { message: "Email is required.", status: "error" }
  }
  if (!baseUrl) {
    return { message: "Base URL is required.", status: "error" }
  }

  const res = await checkAuthorizedForCompanyCRUD(companyId)

  if (res.status === "error") {
    return res
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

  revalidatePath(`/companies/${companyId}`)

  return {
    status: "success",
    signInURL: encodeSignInUrl(email, baseUrl),
  }
}

export const updateCompany = async (
  prevState: FormPassBackState,
  formData: FormData,
  id: number,
): Promise<FormPassBackState> => {
  const res = await checkAuthorizedForCompanyCRUD(id)

  if (res.status === "error") {
    return res
  }
  // Validate things
  const name = formData.get("name")?.toString().trim()
  const slug = formData.get("slug")?.toString().trim()
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

  if (!slug) {
    return { message: "Slug is required.", status: "error" }
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
    // Get previous slug
    const prevCompany = await prisma.companyProfile.findUnique({
      where: { id },
      select: { slug: true },
    })
    if (!prevCompany) {
      return { message: "Company not found.", status: "error" }
    }

    var prevSlug = prevCompany.slug

    await prisma.companyProfile.update({
      where: { id },
      data: { name, summary, website, sector, size, hq, email, phone, founded, slug },
    })
  } catch (e: any) {
    if (e?.code === "P2002" && e?.meta?.target?.includes("name")) {
      return { message: "Company already exists. Please supply a different name.", status: "error" }
    } else {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }
  }

  // If slug changed, redirect
  if (prevSlug !== slug) {
    redirect(`/companies/${slug}`)
  } else {
    revalidatePath(`/companies/${id}`)
  }

  return {
    status: "success",
  }
}

export const deleteCompany = async (
  prevState: FormPassBackState,
  formData: FormData,
  name: string,
  id: number,
): Promise<FormPassBackState> => {
  const res = await checkAuthorizedForCompanyCRUD(id)

  if (res.status === "error") {
    return res
  }

  if (!name) return { message: "Server error: company name is null.", status: "error" }

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
