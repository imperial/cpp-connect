"use server"

import { parseOpportunityType } from "@/lib/parsers"
import { companyOnlyAction } from "@/lib/rbac"
import { FormConfig, FormPassBackState } from "@/lib/types"

import prisma from "../db"
import { processForm } from "../util/forms"
import { urlValidator } from "../validators"
import { Opportunity, OpportunityType } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

type OpportunityFormData = Pick<Opportunity, "position" | "location" | "link" | "type" | "description">

const formConfig: FormConfig<OpportunityFormData> = {
  position: {},
  location: {},
  description: {},
  link: {
    validators: [urlValidator],
  },
  type: {
    parser: parseOpportunityType,
  },
}

export const createOpportunity = companyOnlyAction(
  async (_: FormPassBackState, formData: FormData, companyID: number): Promise<FormPassBackState> => {
    let parsedOpportunity: OpportunityFormData
    try {
      parsedOpportunity = processForm(formData, formConfig)
    } catch (e: any) {
      return { message: e.message, status: "error" }
    }

    const available = true

    // Now add the opportunity to the database
    try {
      const opportunity = await prisma.opportunity.create({
        data: { companyID, available, ...parsedOpportunity },
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
      message: "Opportunity created successfully.",
    }
  },
)

export const updateOpportunity = companyOnlyAction(
  async (
    _: FormPassBackState,
    formData: FormData,
    companyID: number,
    opportunityID: number,
  ): Promise<FormPassBackState> => {
    // TODO: Validate user session

    // Validate things
    let parsedOpportunity: OpportunityFormData
    try {
      parsedOpportunity = processForm(formData, formConfig)
    } catch (e: any) {
      return { message: e.message, status: "error" }
    }
    const available = true

    // Now add the company to the database
    try {
      const opportunity = await prisma.opportunity.update({
        where: { id: opportunityID },
        data: { ...parsedOpportunity, available },
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
  },
)

export const deleteOpportunity = companyOnlyAction(
  async (
    _: FormPassBackState,
    formData: FormData,
    companyID: number,
    opportunityID: number,
    redirectOnDelete: boolean = false,
  ): Promise<FormPassBackState> => {
    let slug = ""
    try {
      slug = (
        await prisma.opportunity.delete({
          where: { id: opportunityID },
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

    return { message: "Succesfully deleted the opportunity.", status: "success" }
  },
)
