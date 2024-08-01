import prisma from "./lib/db"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { Prisma, Role } from "@prisma/client"
import NextAuth, { DefaultSession, NextAuthConfig, User } from "next-auth"
import MicrosoftEntraIDProfile from "next-auth/providers/microsoft-entra-id"

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: Role
  }
}
declare module "next-auth" {
  interface User {
    role: Role
  }
  interface Session {
    user: {
      role: Role
    } & DefaultSession["user"]
  }
}

export const config: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraIDProfile({
      clientId: process.env.MS_ENTRA_CLIENT_ID,
      clientSecret: process.env.MS_ENTRA_CLIENT_SECRET,
      tenantId: process.env.MS_ENTRA_TENANT_ID,
      async profile(profile, tokens) {
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/photos/240x240/$value`, {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        })

        // Confirm that profile photo was returned
        let image
        // TODO: Do this without Buffer
        if (response.ok && typeof Buffer !== "undefined") {
          try {
            const pictureBuffer = await response.arrayBuffer()
            const pictureBase64 = Buffer.from(pictureBuffer).toString("base64")
            image = `data:image/jpeg;base64, ${pictureBase64}`
          } catch {}
        }

        const userProfile: Prisma.UserCreateInput = {
          role: profile.role ?? "STUDENT",
          name: profile.name,
          email: profile.email,
          image,
          eIDPreferredUsername: profile.preferred_username,
        }
        return userProfile
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    // jwt({ token, user }) {
    //   if (user) token.role = user.role
    //   return token
    // },
    session({ session, user, token }) {
      console.log("TOKEN", token)
      console.log("USER", user)
      if (!user?.role) {
        throw new Error("Role not found in user when creating session")
      }
      session.user.role = user?.role
      return session
    },
  },

  // TODO: uncomment when we have a login page
  // pages: {
  //   signIn: "/login"
  // },
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
