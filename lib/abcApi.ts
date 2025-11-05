"use server"

// October is designated as the cut off month for determining the current academic year
const ROLLOVER_MONTH = 9

const ABC_ROOT = process.env.ABC_API || "https://abc-api.doc.ic.ac.uk/"
const ABC_USERNAME = process.env.API_ROLE_USERNAME || "adumble"
const ABC_PASSWORD = process.env.API_ROLE_PASSWORD || "bob"

const abcWithYear = `${ABC_ROOT}/${currentShortYear()}`

/**
 * Returns the current academic year as a short string using today's date: e.g. 14 Feb 2025 -> '2425'
 * The rollover month (i.e. using previous or future year) is a constant.
 *
 * @returns {string} The short year string.
 */
function currentShortYear(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const [curr, prev, next] = [year, year - 1, year + 1].map(y => `${y}`.slice(2))
  return month < ROLLOVER_MONTH ? `${prev}${curr}` : `${curr}${next}`
}

async function fetchFromAbc(endpoint: string, xProxiedUser?: string) {
  const credentials = btoa(`${ABC_USERNAME}:${ABC_PASSWORD}`)

  return fetch(endpoint, {
    headers: new Headers({
      Authorization: `Basic ${credentials}`,
      ...(xProxiedUser ? { "x-proxied-user": xProxiedUser } : {}),
    }),
  })
}

async function getLogin(email: string): Promise<string | null> {
  const endpoint = `${abcWithYear}/identity?email=${encodeURIComponent(email)}`
  const identity = await fetchFromAbc(endpoint)
  if (!identity.ok) return null
  const { login } = await identity.json()
  return login
}

async function getDegreeYear(login: string): Promise<string | null> {
  const endpoint = `${abcWithYear}/students/${login}`
  const student = await fetchFromAbc(endpoint, login)
  if (!student.ok) return null
  const json = await student.json()
  return json.degree_year
}

export async function isPlacementStudent(email: string): Promise<boolean> {
  const login = await getLogin(email)
  if (!login) return false

  const degreeYear = await getDegreeYear(login)
  if (!degreeYear) return false

  return degreeYear.startsWith("m") && degreeYear.endsWith("3")
}
