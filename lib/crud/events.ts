"use server"

import { companyOnlyAction } from "@/lib/rbac"

import prisma from "../db"
import { FormPassBackState } from "../types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createEvent = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyID: number): Promise<FormPassBackState> => {
    const title = formData.get("title")?.toString().trim()
    const dateStart = formData.get("dateStart")?.toString().trim()
    const dateEnd = formData.get("dateEnd")?.toString().trim()
    const shortDescription = formData.get("shortDescription")?.toString().trim()
    const richSummary = formData.get("richSummary")?.toString().trim()
    const spaces = parseInt(formData.get("spaces")?.toString().trim() ?? "-1")
    const location = formData.get("location")?.toString().trim()
    const link = formData.get("link")?.toString().trim()

    // Validate things
    if (!title) {
      return { message: "Title is required.", status: "error" }
    }

    if (!dateStart) {
      return { message: "Date start is required.", status: "error" }
    }

    if (!shortDescription) {
      return { message: "Short description is required.", status: "error" }
    }

    if (!richSummary) {
      return { message: "Summary is required.", status: "error" }
    }

    if (spaces == -1) {
      return { message: "Spaces is required.", status: "error" }
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

export const editEvent = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyID: number, eventID: number): Promise<FormPassBackState> => {
    const title = formData.get("title")?.toString().trim()
    const dateStart = formData.get("dateStart")?.toString().trim()
    const dateEnd = formData.get("dateEnd")?.toString().trim()
    const shortDescription = formData.get("shortDescription")?.toString().trim()
    const richSummary = formData.get("richSummary")?.toString().trim()
    const spaces = parseInt(formData.get("spaces")?.toString().trim() ?? "-1")
    const location = formData.get("location")?.toString().trim()
    const link = formData.get("link")?.toString().trim()

    // Validate things
    if (!title) {
      return { message: "Title is required.", status: "error" }
    }

    if (!dateStart) {
      return { message: "Date start is required.", status: "error" }
    }

    if (!shortDescription) {
      return { message: "Short description is required.", status: "error" }
    }

    if (!richSummary) {
      return { message: "Summary is required.", status: "error" }
    }

    if (spaces == -1) {
      return { message: "Spaces is required.", status: "error" }
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
