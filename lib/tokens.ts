import prisma from "./db"

import { User } from "@prisma/client"

const PROVIDER = "microsoft-entra-id"

const getLatestEntraAccountForUser = async (userId: User["id"]) => {
  const user = await prisma.user.findFirst({
    relationLoadStrategy: "join",
    select: {
      accounts: {
        where: {
          provider: PROVIDER,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
      id: true,
    },
    where: {
      id: userId,
    },
  })

  if (!user || !user.accounts.length) {
    return null
  }
  return user.accounts[0]
}

/**
 * Get the latest access token for a user, refreshing it if needed
 * @param userId User ID from DB of user to get token for
 * @returns null if we couldn't get a token as we got 401 on refresh (unauthorised), so the user needs to sign back in, else return the access token
 * @throws Error if no account, no refresh token, or refresh token fails
 */
export const getEntraAccessToken = async (userId: User["id"]) => {
  const account = await getLatestEntraAccountForUser(userId)

  if (!account) {
    throw new Error("No account")
  }
  if (!account.refresh_token) {
    throw new Error("No refresh token")
  }

  if (account.expires_at && Date.now() / 1000 < account.expires_at) {
    return account.access_token
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${process.env.MS_ENTRA_TENANT_ID}/oauth2/v2.0/token`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.MS_ENTRA_CLIENT_ID!,
        client_secret: process.env.MS_ENTRA_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: account.refresh_token,
      }),
      method: "POST",
    },
  )

  const responseTokens = await response.json()

  if (!response.ok) {
    if (response.status === 401) {
      return null
    }

    throw responseTokens
  }

  await prisma.account.update({
    data: {
      access_token: responseTokens.access_token,
      expires_at: Math.floor(Date.now() / 1000 + responseTokens.expires_in),
      refresh_token: responseTokens.refresh_token ?? account.refresh_token,
    },
    where: {
      provider_providerAccountId: {
        provider: PROVIDER,
        providerAccountId: account.providerAccountId,
      },
    },
  })

  return responseTokens.access_token
}
