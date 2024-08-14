/**
 * RBAC helper functions
 */
import { auth } from "@/auth"
import prisma from "@/lib/db"
import { FormPassBackState, ServerActionDecorator, ServerSideFormHandler } from "@/lib/types"

import { Role, User } from "@prisma/client"
import { Session } from "next-auth"

async function additionalCheckUser<Args extends any[] = any[]>(session: Session, ...args: Args): Promise<boolean> {
  return args.length > 0 && session.user.id === args[0]
}

async function additionalCheckCompany<Args extends any[] = any[]>(session: Session, ...args: Args): Promise<boolean> {
  const user: Pick<User, "associatedCompanyId"> | null = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      associatedCompanyId: true,
    },
  })
  return args.length > 0 && user?.associatedCompanyId === args[0]
}

function protectedAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = any[]>(
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

export function studentOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = any[]>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.STUDENT], additionalCheckUser<Args>)(action)
}

export function companyOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = any[]>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.COMPANY], additionalCheckCompany<Args>)(action)
}

export function adminOnlyAction<T extends FormPassBackState = FormPassBackState, Args extends any[] = any[]>(
  action: ServerSideFormHandler<T, Args>,
) {
  return protectedAction<T, Args>([Role.ADMIN])(action)
}
