"use server"

import { auth } from "@/auth"

import prisma from "../db"
import { FormPassBackState } from "../types"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * Check if a user can be deleted
 * @param userId The id of the user to check
 * @returns A string with a message if the user cannot be deleted, or undefined if they can
 */
export const allowedToDeleteUser = async (userId: string): Promise<string | undefined> => {
  const session = await auth()
  if (!session || !session.user) {
    return "User not logged in."
  }

  // Admins can delete any user
  if (session.user.role === Role.ADMIN) {
    return
  }
  // Users can NOT delete themselves
  if (session.user.id === userId) {
    return "You cannot delete yourself - contact an admin for help"
  }

  // Company users can delete users in the same company
  if (session.user.role === Role.COMPANY) {
    const thisUsersCompanyId = (
      await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          associatedCompanyId: true,
        },
      })
    )?.associatedCompanyId
    const otherUsersCompanyId = (
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          associatedCompanyId: true,
        },
      })
    )?.associatedCompanyId

    return !!thisUsersCompanyId && thisUsersCompanyId === otherUsersCompanyId
      ? undefined
      : "You cannot delete users from other companies."
  }

  return "Operation denied - unauthorised."
}

/**
 * The requirements to allow user deletion are as follows:
 * 1. Any user can delete themselves
 * 2. Admins can delete any user
 * 2. Company users can delete themselves or any user in the same company
 * @param id The id of the user to delete
 * @param pathToInvalidate The path to invalidate in the cache, or redirect to if redirect is set to true
 */
export const deleteUser = async (
  id: string,
  pathToInvalidate: string,
  redirectAfter: boolean = false,
): Promise<FormPassBackState> => {
  const canDelete = await allowedToDeleteUser(id)
  if (typeof canDelete !== "undefined") {
    return {
      message: canDelete,
      status: "error",
    }
  } else {
    try {
      await prisma.user.delete({
        where: {
          id,
        },
      })
    } catch (e: any) {
      return {
        message: "A database error occured. Please try again later.",
        status: "error",
      }
    }

    if (!redirectAfter) {
      revalidatePath(pathToInvalidate)
    } else {
      redirect(pathToInvalidate)
    }

    return {
      status: "success",
      message: "User successfully deleted.",
    }
  }
}
