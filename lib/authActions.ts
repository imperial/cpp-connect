"use server"

import { signIn } from "@/auth"

import { FormPassBackState } from "./types"

import { AccessDenied } from "@auth/core/errors"
import { isRedirectError } from "next/dist/client/components/redirect"

export const signInWithMagicLink = async (
  _prevState: FormPassBackState,
  formData: FormData,
): Promise<FormPassBackState> => {
  try {
    await signIn("nodemailer", formData)
  } catch (e: any) {
    if (e instanceof AccessDenied) {
      return {
        message: "Access denied - invalid email address. Please contact us if this is unexpected.",
        status: "error",
      }
    } else if (isRedirectError(e)) {
      // Propagate the redirect error
      throw e
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
