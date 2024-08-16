"use server"

import { getCompanyLink } from "@/app/companies/getCompanyLink"
import { updateUpload } from "@/lib/files/updateUpload"
import { adminOnlyAction, companyOnlyAction } from "@/lib/rbac"
import { FileCategory } from "@/lib/types"

import prisma from "../db"
import { FormPassBackState } from "../types"
import { encodeSignInUrl } from "../util/signInTokens"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createCompany = adminOnlyAction(async (_, formData) => {
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
      return { message: "A database error occurred. Please try again later.", status: "error" }
    }
  }

  revalidatePath("/companies")

  return {
    status: "success",
    message: "Company created successfully.",
  }
})

export const createCompanyUser = companyOnlyAction<FormPassBackState & { signInURL?: string }>(
  async (_, formData, companyId: number) => {
    const email = formData.get("email")?.toString().trim()
    const baseUrl = formData.get("baseUrl")?.toString().trim()
    if (!email) {
      return { message: "Email is required.", status: "error" }
    }
    if (!baseUrl) {
      return { message: "Base URL is required.", status: "error" }
    }

    // Get slug
    const company = await prisma.companyProfile.findUnique({
      where: { id: companyId },
      select: { slug: true },
    })

    if (!company) {
      return { message: "Company not found.", status: "error" }
    }

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
        return { message: "A database error occurred. Please try again later.", status: "error" }
      }
    }

    revalidatePath(getCompanyLink(company))

    return {
      status: "success",
      message: "Company user created successfully.",
      signInURL: encodeSignInUrl(email, baseUrl),
    }
  },
)

export const updateCompany = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyId: number): Promise<FormPassBackState> => {
    const name = formData.get("name")?.toString().trim()
    const slug = formData.get("slug")?.toString().trim()
    const summary = formData.get("summary")?.toString().trim()
    const banner = formData.get("banner") as File
    const logo = formData.get("logo") as File
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
    } else if (!slug.match(/^[a-z0-9\-]+$/)) {
      return {
        message: "Invalid characters in slug. Only lowercase alphanumeric characters and hyphens are allowed.",
        status: "error",
      }
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

    let prevSlug: string

    // Now update the company in the database
    try {
      // Get previous slug
      const prevCompany = await prisma.companyProfile.findUnique({
        where: { id: companyId },
        select: { slug: true },
      })
      if (!prevCompany) {
        return { message: "Company not found.", status: "error" }
      }

      prevSlug = prevCompany.slug

      await prisma.companyProfile.update({
        where: { id: companyId },
        data: { name, summary, website, sector, size, hq, email, phone, founded, slug },
      })
    } catch (e: any) {
      if (e?.code === "P2002" && e?.meta?.target?.includes("slug")) {
        return {
          message:
            "A company with that slug already exists. Please supply a different slug, or change the company name and slug.",
          status: "error",
        }
      } else {
        return { message: "A database error occurred. Please try again later.", status: "error" }
      }
    }

    const bannerUpdateRes = await updateUpload(
      banner,
      "banners",
      FileCategory.IMAGE,
      async () =>
        (
          await prisma.companyProfile.findUnique({
            where: { id: companyId },
            select: { banner: true },
          })
        )?.banner,
      async path =>
        await prisma.companyProfile.update({
          where: { id: companyId },
          data: { banner: path },
        }),
    )
    if (bannerUpdateRes.status === "error") return bannerUpdateRes

    const logoUpdateRes = await updateUpload(
      logo,
      "logos",
      FileCategory.IMAGE,
      async () =>
        (
          await prisma.companyProfile.findUnique({
            where: { id: companyId },
            select: { logo: true },
          })
        )?.logo,
      async path =>
        await prisma.companyProfile.update({
          where: { id: companyId },
          data: { logo: path },
        }),
    )
    if (logoUpdateRes.status === "error") return logoUpdateRes

    // If slug changed, redirect
    if (prevSlug !== slug) {
      redirect(getCompanyLink({ slug: slug }))
    } else {
      revalidatePath(getCompanyLink({ slug: slug }))
    }

    return {
      status: "success",
      message: "Company updated successfully.",
    }
  },
)

export const deleteCompany = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyId: number, name: string): Promise<FormPassBackState> => {
    if (!name) return { message: "Server error: company name is null.", status: "error" }

    const enteredName = formData.get("name")?.toString().trim()
    if (!enteredName) {
      return { message: "Enter the company name to confirm deletion.", status: "error" }
    }
    if (enteredName.toLowerCase() !== name.toLowerCase()) {
      return { message: "Entered name did not match company name. Please try again.", status: "error" }
    }

    // Now remove the company from the database
    // TODO: also remove associated files
    try {
      await prisma.companyProfile.delete({
        where: { id: companyId },
      })
    } catch (e: any) {
      return { message: "A database error occurred. Please try again later.", status: "error" }
    }
    redirect("/companies")
  },
)
