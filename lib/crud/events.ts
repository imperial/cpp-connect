"use server"

import { deleteFile } from "@/lib/files/deleteFile"
import { updateUpload } from "@/lib/files/updateUpload"
import { companyOnlyAction } from "@/lib/rbac"
import { FileCategory, FormConfig, FormPassBackState } from "@/lib/types"
import { urlValidator } from "@/lib/validators"

import prisma from "../db"
import { parseDateTime, parseNonNegativeInt } from "../parsers"
import { processForm } from "../util/forms"
import { Event } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type EventFormData = Omit<Event, "id" | "companyID" | "createdAt" | "updatedAt" | "attachment">

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
    optional: true,
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
    const attachment = formData.get("attachment") as File

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

      const attachmentUpdateRes = await updateUpload(
        attachment,
        "attachments",
        FileCategory.DOCUMENT,
        async () =>
          (
            await prisma.event.findUnique({
              where: { id: event.id },
              select: { attachment: true },
            })
          )?.attachment,
        async path =>
          await prisma.event.update({
            where: { id: event.id },
            data: { attachment: path },
          }),
      )
      if (attachmentUpdateRes.status === "error") return attachmentUpdateRes

      revalidatePath(`/companies/${event.company.slug}`)
    } catch (e: any) {
      return { message: "A database error occurred. Please try again later.", status: "error" }
    }

    return {
      status: "success",
      message: "Event created successfully.",
    }
  },
)

export const updateEvent = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, _companyID: number, eventID: number): Promise<FormPassBackState> => {
    const attachment = formData.get("attachment") as File

    let parsedEvent: EventFormData
    try {
      parsedEvent = processForm(formData, formConfig)
    } catch (e: any) {
      return { message: e.message, status: "error" }
    }
    // Now add the event to the database
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

      const attachmentUpdateRes = await updateUpload(
        attachment,
        "attachments",
        FileCategory.DOCUMENT,
        async () =>
          (
            await prisma.event.findUnique({
              where: { id: eventID },
              select: { attachment: true },
            })
          )?.attachment,
        async path =>
          await prisma.event.update({
            where: { id: eventID },
            data: { attachment: path },
          }),
      )
      if (attachmentUpdateRes.status === "error") return attachmentUpdateRes

      revalidatePath(`/companies/${event.company.slug}`)
    } catch (e: any) {
      return { message: "A database error occurred. Please try again later.", status: "error" }
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
    _formData: FormData,
    _companyID: number,
    eventID: number,
    redirectOnDelete: boolean = false,
  ): Promise<FormPassBackState> => {
    let slug = ""

    // Delete attachment
    try {
      const files = await prisma.event.findUnique({
        where: { id: eventID },
        select: { attachment: true },
      })
      if (files?.attachment) {
        await deleteFile(files.attachment)
      }
    } catch (e: any) {
      return { message: "An error occurred while deleting the attachment. Please try again later.", status: "error" }
    }

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
      return { message: "A database error occurred. Please try again later.", status: "error" }
    }

    if (redirectOnDelete) {
      redirect(`/companies/${slug}`)
    } else {
      revalidatePath(`/companies/${slug}`)
    }

    return { message: "Successfully deleted the event.", status: "success" }
  },
)
