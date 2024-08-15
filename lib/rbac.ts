/**
 * RBAC helper functions
 */
import { auth } from "@/auth"
import prisma from "@/lib/db"
import { FormPassBackState, ServerActionDecorator, ServerSideFormHandler } from "@/lib/types"

import { Role, User } from "@prisma/client"
import { Session } from "next-auth"

async function additionalCheckStudent(session: Session, studentID: string, ...args: any[]): Promise<boolean> {
  return session.user.id === studentID
}

async function additionalCheckCompany(session: Session, companyID: number, ...args: any[]): Promise<boolean> {
  const user: Pick<User, "associatedCompanyId"> | null = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      associatedCompanyId: true,
    },
  })
  return typeof user !== "undefined" && !!user && user.associatedCompanyId === companyID
}

/**
 * Usage: you can create your custom decorators by calling this function with the allowed roles and an optional additionalCheck function
 * @param allowedRoles a list of Roles that are allowed to access the action
 * @param additionalCheck an optional function that can be used to perform additional checks on the session (e.g. checking if the user is the owner of a resource)
 * @returns a decorator that can be used to protect an action
 */
function protectedAction<T extends FormPassBackState, Args extends unknown[]>(
  allowedRoles: Role[],
  additionalCheck: (session: Session, ...args: Args) => Promise<boolean> = async () => true,
): ServerActionDecorator<T, Args> {
  function actionDecorator(action: ServerSideFormHandler<T, Args>) {
    async function actionCaller(prevState: T, formData: FormData, ...args: Args): Promise<T> {
      const session = await auth()
      if (
        typeof session?.user.role !== "undefined" &&
        (session.user.role === Role.ADMIN ||
          (allowedRoles.includes(session.user.role) && (await additionalCheck(session, ...args))))
      ) {
        return await action(prevState, formData, ...args)
      }
      return { ...prevState, message: "Operation denied - unauthorized.", status: "error" }
    }
    return actionCaller
  }
  return actionDecorator
}

/**
 * The additionalCheck function for this decorator checks if the student is the owner of the resource (e.g. if they are not attempting to change someone else's profile)
 * @param action the action to protect. It's 3rd argument must be the user ID.
 * @returns a decorator that can be used to protect an action that can only be accessed by students
 */
export function studentOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends unknown[] = unknown[]>(
  action: ServerSideFormHandler<T, [studentID: string, ...Args]>,
) {
  return protectedAction<T, [studentID: string, ...Args]>([Role.STUDENT], additionalCheckStudent)(action)
}

/**
 * The additionalCheck function for this decorator checks if the company is the owner of the resource (e.g. if they are not attempting to change someone else's company profile)
 * @param action the action to protect. It's 3rd argument must be the company ID.
 * @returns a decorator that can be used to protect an action that can only be accessed by companies
 */
export function companyOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends unknown[] = unknown[]>(
  action: ServerSideFormHandler<T, [companyID: number, ...Args]>,
) {
  return protectedAction<T, [companyID: number, ...Args]>([Role.COMPANY], additionalCheckCompany)(action)
}

export function adminOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = any[]>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.ADMIN])(action)
}
