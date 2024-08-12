/**
 * RBAC helper functions
 */
import { auth } from "@/auth"
import { FormPassBackState, ServerActionDecorator, ServerSideFormHandler } from "@/lib/types"

import { Role, User } from "@prisma/client"

const roleIs = (roleToCheck: Role, role: Role | Role[]): boolean => {
  if (Array.isArray(role)) {
    return role.includes(roleToCheck)
  }
  return role === roleToCheck
}

export const restrictAdmin = (role: Role): boolean => roleIs(role, Role.ADMIN)
export const restrictCompany = (
  user: Pick<User, "associatedCompanyId" | "role"> | null,
  expectedCompanyId: number,
): boolean => {
  if (!user) {
    return false
  }

  switch (user.role) {
    case Role.ADMIN:
      return true
    case Role.COMPANY:
      return (
        typeof user.associatedCompanyId !== "undefined" &&
        !!expectedCompanyId &&
        user.associatedCompanyId === expectedCompanyId
      )
    default:
      return false
  }
}
export const restrictUser = (role: Role): boolean => roleIs(role, [Role.STUDENT, Role.ADMIN])

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

export function studentOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = []>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.STUDENT])(action)
}

export function companyOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = []>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.COMPANY])(action)
}

export function adminOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = []>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.ADMIN])(action)
}
