"use server"

import { currentShortYear } from "@/lib/util/academicYear"

const ABC_ROOT = process.env.ABC_API || "https://abc-api.doc.ic.ac.uk/"
const ABC_USERNAME = process.env.API_ROLE_USERNAME || "adumble"
const ABC_PASSWORD = process.env.API_ROLE_PASSWORD || "bob"

const abcCurrentYear = `${ABC_ROOT}/${currentShortYear()}`

async function fetchFromAbc(endpoint: string, xProxiedUser?: string) {
  const credentials = Buffer.from(`${ABC_USERNAME}:${ABC_PASSWORD}`).toString("base64")

  return fetch(endpoint, {
    headers: new Headers({
      Authorization: `Basic ${credentials}`,
      ...(xProxiedUser ? { "x-proxied-user": xProxiedUser } : {}),
    }),
  })
}

async function getLogin(email: string): Promise<string | null> {
  const endpoint = `${abcCurrentYear}/identity?email=${encodeURIComponent(email)}`
  const identity = await fetchFromAbc(endpoint)
  if (!identity.ok) return null
  const { login } = await identity.json()
  return login
}

async function getDegreeYear(login: string): Promise<string | null> {
  const endpoint = `${abcCurrentYear}/students/${login}`
  const student = await fetchFromAbc(endpoint, login)
  if (!student.ok) return null
  const { degree_year } = await student.json()
  return degree_year
}

/**
 * Returns `true` only if the student is a third-year Master's student. This should be used to restrict the visibility of opportunities marked as placements.
 *
 * @param email - The student's email address.
 * @returns {Promise<boolean>} Resolves to `true` when the student is a third-year Master's student; otherwise `false`.
 */
export async function isPlacementStudent(email: string | null | undefined): Promise<boolean> {
  if (!email) return false

  const login = await getLogin(email)
  if (!login) return false

  const degreeYear = await getDegreeYear(login)
  if (!degreeYear) return false

  return degreeYear.startsWith("m") && degreeYear.endsWith("3")
}
