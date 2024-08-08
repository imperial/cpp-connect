"use server"

import { signIn } from "@/auth"

import { FormPassBackState } from "./types"

import { AccessDenied } from "@auth/core/errors"

export const signInWithMagicLink = async (
  prevState: FormPassBackState,
  formData: FormData,
): Promise<FormPassBackState> => {
  try {
    await signIn("nodemailer", formData)
  } catch (e: any) {
    if (e instanceof AccessDenied) {
      return {
        message: "Access denied - invalid email address. Please contact if this is unexpected.",
        status: "error",
      }
    }
    return {
      message: `A server error occurred. Please try again. ${e?.message ?? e}`,
      status: "error",
    }
  }

  return {
    message: "success",
    status: "success",
  }
}
