import { Prisma, Role } from "@prisma/client"
import { DefaultSession, NextAuthConfig } from "next-auth"
import MicrosoftEntraIDProfile from "next-auth/providers/microsoft-entra-id"
import Nodemailer from "next-auth/providers/nodemailer"
import prisma from "./lib/db"
import { getDepartment } from "./lib/graph"

const ALLOWED_ADMINS = process.env.CPP_ALLOWED_ADMINS?.split(",") ?? []
const ALLOWED_DEPARTMENTS = process.env.CPP_ALLOWED_DEPARTMENTS?.split(",") ?? ["Computing"]

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: Role
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    role: Role,
    id: string
  }
}
declare module "next-auth" {
  interface User {
    role: Role
  }
  interface Session {
    user: {
      role: Role,
      id: string
    } & DefaultSession["user"]
  }
  interface JWT {
    role: Role,
    id: string
  }
}

export default {
  debug: true,
  providers: [
    MicrosoftEntraIDProfile({
      clientId: process.env.MS_ENTRA_CLIENT_ID,
      clientSecret: process.env.MS_ENTRA_CLIENT_SECRET,
      tenantId: process.env.MS_ENTRA_TENANT_ID,
      authorization: {
        params: {
          scope: "offline_access openid profile email User.Read",
        }
      },
      async profile(profile) {

        // By default the role is STUDENT unless in admins
        const role: Role = ALLOWED_ADMINS.includes(profile.email) ? "ADMIN" : "STUDENT"

        // Update role if user already exists
        const currentUser = await prisma.user.findUnique({
          select: {
            role: true,
          },
          where: {
            email: profile.email,
          },
        })
        if (currentUser && currentUser.role !== role) {
          await prisma.user.update({
            data: {
              role: role,
            },
            where: {
              email: profile.email,
            },
          })
        }

        const user: Prisma.UserCreateInput = {
          id: profile.sub,
          role,
          name: profile.name,
          email: profile.email,
          studentProfile: (role === "STUDENT") ? {
            create: {
              studentShortcode: profile.preferred_username.split("@")[0],
            }
          } : undefined
        }

        return user
      },
    }),
  ],


  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    signIn: async ({ account, user }) => {
      // HACK: TODO: Put a proper handler in here
      return true
      // Admins always have access
      if (user.role === "ADMIN") {
        return true
      } else if (!account?.access_token) {
        return false
      }
      const department = await getDepartment(account?.access_token);
      return department && ALLOWED_DEPARTMENTS.includes(department)
    },
    jwt({ token, user }) {
      if (user) {
        if (user.role) {
          token.role = user.role
        }

        if (user.id) {
          token.id = user.id
        }
      }

      // Clear image
      if (token.picture) {
        delete token.picture
      }

      if (token.image) {
        delete token.image
      }

      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.id
      return session
    },
  },

  // TODO: uncomment when we have a login page
  // pages: {
  //   signIn: "/login"
  // },
} satisfies NextAuthConfig
