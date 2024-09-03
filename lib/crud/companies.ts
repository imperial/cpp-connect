"use server"

import { getCompanyLink } from "@/app/companies/getCompanyLink"
import { auth } from "@/auth"
import { deleteFile } from "@/lib/files/deleteFile"
import { updateUpload } from "@/lib/files/updateUpload"
import { adminOnlyAction, companyOnlyAction } from "@/lib/rbac"
import { FileCategory, FormConfig } from "@/lib/types"
import { slugValidator, urlValidator } from "@/lib/validators"

import prisma from "../db"
import { FormPassBackState } from "../types"
import { processForm } from "../util/forms"
import { encodeSignInUrl } from "../util/signInTokens"
import { CompanyProfile, Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type CompanyCreateFormData = Pick<CompanyProfile, "name" | "slug" | "website" | "sector">
type CompanyUpdateFormData = Omit<CompanyProfile, "id" | "logo" | "banner">
type CompanyUserCreateFormData = { email: string; baseUrl: string }

const formConfigCreate: FormConfig<CompanyCreateFormData> = {
  name: {},
  slug: {
    validators: [slugValidator],
  },
  website: {
    validators: [urlValidator],
  },
  sector: {},
}

const formConfigUpdate: FormConfig<CompanyUpdateFormData> = {
  ...formConfigCreate,
  summary: { optional: true },
  size: { optional: true },
  hq: { optional: true },
  email: { optional: true },
  phone: { optional: true },
  founded: { optional: true },
}

const formConfigUserCreate: FormConfig<CompanyUserCreateFormData> = {
  email: {},
  baseUrl: {},
}

export const createCompany = adminOnlyAction(async (_, formData) => {
  let parsedCompany: CompanyCreateFormData
  try {
    parsedCompany = processForm(formData, formConfigCreate)
  } catch (e: any) {
    return { message: e.message, status: "error" }
  }

  // Now add the company to the database
  try {
    await prisma.companyProfile.create({
      data: parsedCompany,
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
    let parsedForm: CompanyUserCreateFormData
    try {
      parsedForm = processForm(formData, formConfigUserCreate)
    } catch (e: any) {
      return { status: "error", message: e.message }
    }
    const { email, baseUrl } = parsedForm

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
    const banner = formData.get("banner") as File
    const logo = formData.get("logo") as File

    let parsedCompany: CompanyUpdateFormData
    try {
      parsedCompany = processForm(formData, formConfigUpdate)
    } catch (e: any) {
      return { message: e.message, status: "error" }
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
        data: parsedCompany,
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
    if (prevSlug !== parsedCompany.slug) {
      redirect(getCompanyLink({ slug: parsedCompany.slug }))
    } else {
      revalidatePath(getCompanyLink({ slug: parsedCompany.slug }))
    }

    return {
      status: "success",
      message: "Company updated successfully.",
    }
  },
)

export const deleteCompany = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyId: number, name: string): Promise<FormPassBackState> => {
    const session = await auth()
    if (!name) return { message: "Server error: company name is null.", status: "error" }

    const enteredName = formData.get("name")?.toString().trim()
    if (!enteredName) {
      return { message: "Enter the company name to confirm deletion.", status: "error" }
    }
    if (enteredName.toLowerCase() !== name.toLowerCase()) {
      return { message: "Entered name did not match company name. Please try again.", status: "error" }
    }

    // Delete uploaded files (banner and logo) related to the company
    try {
      const files = await prisma.companyProfile.findUnique({
        where: { id: companyId },
        select: { logo: true, banner: true },
      })
      if (files?.logo) {
        await deleteFile(files.logo)
      }
      if (files?.banner) {
        await deleteFile(files.banner)
      }
    } catch (e: any) {
      return { message: "An error occurred while deleting logo or banner. Please try again later.", status: "error" }
    }

    // Now remove the company from the database
    try {
      await prisma.companyProfile.delete({
        where: { id: companyId },
      })
    } catch (e: any) {
      return { message: "A database error occurred. Please try again later.", status: "error" }
    }

    if (session!.user.role === Role.ADMIN) {
      redirect("/companies")
    } else {
      return { message: "Company deleted successfully.", status: "success" }
    }
  },
)
