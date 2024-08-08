/**
 * RBAC helper functions
 */
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
