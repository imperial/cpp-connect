import prisma from "@/lib/db"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { Role } from "@prisma/client"
import NextAuth, { DefaultSession, NextAuthConfig, User } from "next-auth"
import AzureAd from "next-auth/providers/azure-ad"

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: Role
  }
}
declare module "next-auth" {
  interface Session {
    user: {
      role: Role
    } & DefaultSession["user"]
  }
}

export const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AzureAd({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      profile(profile) {
        return { role: profile.role ?? "STUDENT", ...profile }
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    session({ session, user }) {
      if (!user?.role) {
        throw new Error("Role not found in user when creating session")
      }
      session.user.role = user.role
      return session
    },
  },

  // TODO: uncomment when we have a login page
  // pages: {
  //   signIn: "/login"
  // },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
