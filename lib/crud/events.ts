"use server"

import { parseDateTime } from "@/lib/parseDateTime"
import { companyOnlyAction } from "@/lib/rbac"

import prisma from "../db"
import { FormPassBackState } from "../types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const parseNonNegativeInt = (rawNum: FormDataEntryValue | null): number => {
  if (!rawNum) {
    return NaN
  }
  const num = parseInt(rawNum.toString().trim())
  if (isNaN(num) || num < 0) {
    return NaN
  }
  return num
}

export const createEvent = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyID: number): Promise<FormPassBackState> => {
    const title = formData.get("title")?.toString().trim()
    const shortDescription = formData.get("shortDescription")?.toString().trim()
    const richSummary = formData.get("richSummary")?.toString().trim()
    const spaces = parseNonNegativeInt(formData.get("spaces"))
    const location = formData.get("location")?.toString().trim()
    const link = formData.get("link")?.toString().trim()
    const dateEnd = parseDateTime(formData.get("dateEnd"))
    const dateStart = parseDateTime(formData.get("dateStart"))

    // Validate things
    if (!dateStart) {
      return { message: "Start date is required.", status: "error" }
    }

    if (!!dateEnd && dateEnd < dateStart) {
      return { message: "End date must be after start date.", status: "error" }
    }

    if (!title) {
      return { message: "Title is required.", status: "error" }
    }

    if (!shortDescription) {
      return { message: "Short description is required.", status: "error" }
    }

    if (!richSummary) {
      return { message: "Summary is required.", status: "error" }
    }

    if (isNaN(spaces)) {
      return { message: "Invalid number of spaces. Please enter a non-negative integer.", status: "error" }
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

    // Now add the event to the database
    try {
      const event = await prisma.event.create({
        data: { title, dateStart, dateEnd, shortDescription, richSummary, spaces, location, link, companyID },
        include: {
          company: {
            select: {
              slug: true,
            },
          },
        },
      })

      revalidatePath(`/companies/${event.company.slug}`)
    } catch (e: any) {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }

    return {
      status: "success",
      message: "Event created successfully.",
    }
  },
)

export const updateEvent = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyID: number, eventID: number): Promise<FormPassBackState> => {
    const title = formData.get("title")?.toString().trim()
    const shortDescription = formData.get("shortDescription")?.toString().trim()
    const richSummary = formData.get("richSummary")?.toString().trim()
    const spaces = parseNonNegativeInt(formData.get("spaces"))
    const location = formData.get("location")?.toString().trim()
    const link = formData.get("link")?.toString().trim()
    const dateEnd = parseDateTime(formData.get("dateEnd"))
    const dateStart = parseDateTime(formData.get("dateStart"))
    // Validate things

    if (!dateStart) {
      return { message: "Start date is required.", status: "error" }
    }

    if (!!dateEnd && dateEnd < dateStart) {
      return { message: "End date must be after start date.", status: "error" }
    }

    if (!title) {
      return { message: "Title is required.", status: "error" }
    }

    if (!shortDescription) {
      return { message: "Short description is required.", status: "error" }
    }

    if (!richSummary) {
      return { message: "Summary is required.", status: "error" }
    }

    if (isNaN(spaces)) {
      return { message: "Invalid number of spaces. Please enter a non-negative integer.", status: "error" }
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

    // Now add the company to the database
    try {
      const event = await prisma.event.update({
        where: { id: eventID },
        data: { title, dateStart, dateEnd, shortDescription, richSummary, spaces, location, link },
        include: {
          company: {
            select: {
              slug: true,
            },
          },
        },
      })

      revalidatePath(`/companies/${event.company.slug}`)
    } catch (e: any) {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }

    return {
      status: "success",
      message: "Event updated successfully.",
    }
  },
)

export const deleteEvent = companyOnlyAction(
  async (
    _: FormPassBackState,
    formData: FormData,
    companyID: number,
    eventID: number,
    redirectOnDelete: boolean = false,
  ): Promise<FormPassBackState> => {
    let slug = ""
    try {
      slug = (
        await prisma.event.delete({
          where: { id: eventID },
          include: {
            company: {
              select: {
                slug: true,
              },
            },
          },
        })
      ).company.slug
    } catch (e: any) {
      return { message: "A database error occured. Please try again later.", status: "error" }
    }

    if (redirectOnDelete) {
      redirect(`/companies/${slug}`)
    } else {
      revalidatePath(`/companies/${slug}`)
    }

    return { message: "Succesfully deleted the event.", status: "success" }
  },
)
