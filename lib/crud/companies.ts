"use server"

import { auth } from "@/auth"

import prisma from "../db"
import { restrictCompany } from "../rbac"
import { FormPassBackState, ServerActionDecorator, ServerSideFormHandler } from "../types"
import { encodeSignInUrl } from "../util/signInTokens"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createCompany = adminOnlyAction(async (prevState, formData) => {
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
    message: "Company created successfully.",
  }
})

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
  return { status: "success", message: "success" }
}

export const createCompanyUser: ServerSideFormHandler<FormPassBackState & { signInURL?: string }> = companyOnlyAction(
  async (prevState, formData) => {
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
      message: "Company user created successfully.",
      signInURL: encodeSignInUrl(email, baseUrl),
    }
  },
)

export const updateCompany = companyOnlyAction(
  async (prevState: FormPassBackState, formData: FormData, id: number): Promise<FormPassBackState> => {
    const res = await checkAuthorizedForCompanyCRUD(id)

    if (res.status === "error") {
      return res
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
      message: "Company updated successfully.",
    }
  },
)

export const deleteCompany = companyOnlyAction(
  async (prevState: FormPassBackState, formData: FormData, name: string, id: number): Promise<FormPassBackState> => {
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
  },
)

function protectedAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = []>(
  allowedRoles: Role[],
): ServerActionDecorator<T, Args> {
  function actionDecorator(action: ServerSideFormHandler<T, Args>) {
    async function actionCaller(prevState: T, formData: FormData, ...args: Args): Promise<T> {
      const session = await auth()
      if (
        typeof session?.user.role !== "undefined" &&
        (session.user.role === Role.ADMIN || allowedRoles.includes(session.user.role))
      ) {
        return await action(prevState, formData, ...args)
      }
      return { ...prevState, message: "Operation denied - unauthorized.", status: "error" }
    }
    return actionCaller
  }
  return actionDecorator
}

function studentOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = []>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.STUDENT])(action)
}

function companyOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = []>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.COMPANY])(action)
}

function adminOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = []>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.ADMIN])(action)
}
