"use server"

import prisma from "../db"
import { FormPassBackState } from "../types"
import { OpportunityType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const createOpportunity = async (
  _: FormPassBackState,
  formData: FormData,
  companyID: number,
): Promise<FormPassBackState> => {
  // TODO: Validate user session

  // Validate things
  const position = formData.get("position")?.toString().trim()
  const location = formData.get("location")?.toString().trim()
  const link = formData.get("link")?.toString().trim()
  const type = formData.get("type")?.toString().trim() as OpportunityType
  const description = formData.get("description")?.toString().trim()
  const available = true

  if (!position) {
    return { message: "Position is required.", status: "error" }
  }

  if (!location) {
    return { message: "Location is required.", status: "error" }
  }

  if (!link) {
    return { message: "Link is required.", status: "error" }
  } else {
    try {
      new URL(link.toString())
    } catch (_) {
      return { message: "Invalid link URL.", status: "error" }
    }
  }

  if (!type) {
    return { message: "Type is required.", status: "error" }
  }

  if (!description) {
    return { message: "Description is required.", status: "error" }
  }

  // Now add the company to the database
  try {
    const opportunity = await prisma.opportunity.create({
      data: { companyID, position, location, available, link, type, description },
      include: {
        company: {
          select: {
            slug: true,
          },
        },
      },
    })

    revalidatePath(`/companies/${opportunity.company.slug}`)
  } catch (e: any) {
    return { message: "A database error occured. Please try again later.", status: "error" }
  }

  return {
    status: "success",
    message: "success",
  }
}

export const updateOpportunity = async (
  _: FormPassBackState,
  formData: FormData,
  opportunityID: number,
): Promise<FormPassBackState> => {
  // TODO: Validate user session

  // Validate things
  const position = formData.get("position")?.toString().trim()
  const location = formData.get("location")?.toString().trim()
  const link = formData.get("link")?.toString().trim()
  const type = formData.get("type")?.toString().trim() as OpportunityType
  const description = formData.get("description")?.toString().trim()
  const available = true

  if (!position) {
    return { message: "Position is required.", status: "error" }
  }

  if (!location) {
    return { message: "Location is required.", status: "error" }
  }

  if (!link) {
    return { message: "Link is required.", status: "error" }
  } else {
    try {
      new URL(link.toString())
    } catch (_) {
      return { message: "Invalid link URL.", status: "error" }
    }
  }

  if (!type) {
    return { message: "Type is required.", status: "error" }
  }

  if (!description) {
    return { message: "Description is required.", status: "error" }
  }

  // Now add the company to the database
  try {
    const opportunity = await prisma.opportunity.update({
      where: { id: opportunityID },
      data: { position, location, available, link, type, description },
      include: {
        company: {
          select: {
            slug: true,
          },
        },
      },
    })

    revalidatePath(`/companies/${opportunity.company.slug}`)
  } catch (e: any) {
    return { message: "A database error occured. Please try again later.", status: "error" }
  }

  return {
    status: "success",
    message: "success",
  }
}
