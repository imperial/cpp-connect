import { Prisma, Role } from "@prisma/client"
import { se } from "date-fns/locale"
import { DefaultSession, NextAuthConfig } from "next-auth"
import MicrosoftEntraIDProfile from "next-auth/providers/microsoft-entra-id"

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
      async profile(profile, tokens) {
        // From https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/microsoft-entra-id.ts
        // TODO: Stick behind proxy route as won't fit into JWT

        const userProfile: Prisma.UserCreateInput = {
          id: profile.sub,
          role: profile.role ?? "STUDENT",
          name: profile.name,
          email: profile.email,
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
