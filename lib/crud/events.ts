"use server"

import { companyOnlyAction } from "@/lib/rbac"
import { FormConfig, FormPassBackState } from "@/lib/types"
import { urlValidator } from "@/lib/validators"

import prisma from "../db"
import { parseDateTime, parseNonNegativeInt } from "../parsers"
import { processForm } from "../util/forms"
import { Event } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type EventFormData = Omit<Event, "id" | "companyID" | "createdAt" | "updatedAt">

const formConfig: FormConfig<EventFormData> = {
  title: {},
  shortDescription: {},
  richSummary: {},
  location: {},
  spaces: {
    parser: parseNonNegativeInt,
  },
  link: {
    validators: [urlValidator],
  },
  dateStart: {
    parser: parseDateTime,
  },
  dateEnd: {
    parser: parseDateTime,
    optional: true,
  },
}

export const createEvent = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyID: number): Promise<FormPassBackState> => {
    let parsedEvent: EventFormData
    try {
      parsedEvent = processForm(formData, formConfig)
    } catch (e: any) {
      return { message: e.message, status: "error" }
    }

    // Now add the event to the database
    try {
      const event = await prisma.event.create({
        data: { ...parsedEvent, companyID },
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
    let parsedEvent: EventFormData
    try {
      parsedEvent = processForm(formData, formConfig)
    } catch (e: any) {
      return { message: e.message, status: "error" }
    }
    // Now add the company to the database
    try {
      const event = await prisma.event.update({
        where: { id: eventID },
        data: parsedEvent,
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
