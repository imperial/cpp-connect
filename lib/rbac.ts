/**
 * RBAC helper functions
 */
import { Role } from "@prisma/client"

const roleIs = (roleToCheck: Role, role: Role | Role[]): boolean => {
  if (Array.isArray(role)) {
    return role.includes(roleToCheck)
  }
  return role === roleToCheck
}

export const restrictAdmin = (role: Role): boolean => roleIs(role, Role.ADMIN)
export const restrictCompany = (role: Role): boolean => roleIs(role, [Role.COMPANY, Role.ADMIN])
export const restrictUser = (role: Role): boolean => roleIs(role, [Role.STUDENT, Role.ADMIN])
